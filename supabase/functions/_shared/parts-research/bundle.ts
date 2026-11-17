import { type Evidence, MAX_BYTES, PART } from "./types.ts";
import { validatePack } from "./pack.ts";

const decoder = new TextDecoder("utf-8", { fatal: true });
const encoder = new TextEncoder();
function ensure(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(`Invalid bundle: ${message}`);
}
function view(bytes: Uint8Array) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export type ZipEntry = {
  name: string;
  method: number;
  size: number;
  compressedSize: number;
  crc: number;
  offset: number;
  dataOffset: number;
  central: Uint8Array;
};
export function readZip(bytes: Uint8Array) {
  ensure(bytes.length >= 22 && bytes.length <= 64_000_000, "archive size");
  const v = view(bytes);
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (
      v.getUint32(i, true) === 0x06054b50 &&
      i + 22 + v.getUint16(i + 20, true) === bytes.length
    ) {
      end = i;
      break;
    }
  }
  ensure(end >= 0, "end record missing");
  const count = v.getUint16(end + 10, true),
    centralSize = v.getUint32(end + 12, true),
    centralOffset = v.getUint32(end + 16, true);
  ensure(
    v.getUint16(end + 4, true) === 0 && v.getUint16(end + 6, true) === 0 &&
      v.getUint16(end + 8, true) === count && count < 4096 && count > 0 &&
      centralOffset + centralSize === end,
    "split, ZIP64 or malformed archive",
  );
  const entries: ZipEntry[] = [];
  const names = new Set<string>();
  let pos = centralOffset;
  for (let i = 0; i < count; i++) {
    ensure(
      pos + 46 <= end && v.getUint32(pos, true) === 0x02014b50,
      "central record",
    );
    const flags = v.getUint16(pos + 8, true),
      method = v.getUint16(pos + 10, true),
      crc = v.getUint32(pos + 16, true);
    const compressedSize = v.getUint32(pos + 20, true),
      size = v.getUint32(pos + 24, true),
      nameLength = v.getUint16(pos + 28, true);
    const length = 46 + nameLength + v.getUint16(pos + 30, true) +
        v.getUint16(pos + 32, true),
      offset = v.getUint32(pos + 42, true);
    ensure(
      pos + length <= end && offset + 30 <= centralOffset && !(flags & 1) &&
        [0, 8].includes(method) && size !== 0xffffffff &&
        compressedSize !== 0xffffffff && v.getUint16(pos + 34, true) === 0,
      "unsupported entry",
    );
    const nameBytes = bytes.subarray(pos + 46, pos + 46 + nameLength);
    const name = decoder.decode(nameBytes);
    ensure(
      (flags & 0x800) || nameBytes.every((b) => b < 128),
      "non-UTF-8 filename",
    );
    ensure(
      name.length > 0 && !name.startsWith("/") && !name.includes("\\") &&
        !name.includes(":") && !name.includes("\0") &&
        !name.split("/").some((p) => p === "." || p === "..") &&
        !names.has(name.toLowerCase()),
      "unsafe or duplicate path",
    );
    names.add(name.toLowerCase());
    ensure(
      (v.getUint32(pos + 38, true) >>> 16 & 0xf000) !== 0xa000,
      "symlink entry",
    );
    ensure(
      v.getUint32(offset, true) === 0x04034b50 &&
        v.getUint16(offset + 6, true) === flags &&
        v.getUint16(offset + 8, true) === method &&
        v.getUint16(offset + 26, true) === nameLength,
      "local/central mismatch",
    );
    const dataOffset = offset + 30 + nameLength +
      v.getUint16(offset + 28, true);
    ensure(
      dataOffset + compressedSize <= centralOffset &&
        decoder.decode(
            bytes.subarray(offset + 30, offset + 30 + nameLength),
          ) === name,
      "local data/name",
    );
    entries.push({
      name,
      method,
      size,
      compressedSize,
      crc,
      offset,
      dataOffset,
      central: bytes.slice(pos, pos + length),
    });
    pos += length;
  }
  ensure(pos === end, "trailing central records");
  const sorted = [...entries].sort((a, b) => a.offset - b.offset);
  for (let i = 1; i < sorted.length; i++) {
    ensure(
      sorted[i].offset >=
        sorted[i - 1].dataOffset + sorted[i - 1].compressedSize,
      "overlapping records",
    );
  }
  return {
    entries,
    centralOffset,
    centralSize,
    comment: bytes.slice(end + 22),
  };
}
export async function entryBytes(
  zip: Uint8Array,
  entry: ZipEntry,
): Promise<Uint8Array> {
  ensure(entry.size <= MAX_BYTES, "manifest too large");
  const compressed = zip.slice(
    entry.dataOffset,
    entry.dataOffset + entry.compressedSize,
  );
  let bytes = compressed;
  if (entry.method === 8) {
    const stream = new Blob([compressed]).stream().pipeThrough(
      new DecompressionStream("deflate-raw"),
    );
    const reader = stream.getReader();
    const pieces: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        ensure(total <= MAX_BYTES, "inflated manifest too large");
        pieces.push(value);
      }
    } catch (error) {
      await reader.cancel().catch(() => {});
      throw error;
    } finally {
      reader.releaseLock();
    }
    bytes = new Uint8Array(total);
    let offset = 0;
    for (const piece of pieces) {
      bytes.set(piece, offset);
      offset += piece.length;
    }
  }
  ensure(
    bytes.length === entry.size && crc32(bytes) === entry.crc,
    "entry checksum",
  );
  return bytes;
}

/** Classic ZIP append: original local records and central entries are copied unchanged. */
export async function personaliseBundle(
  base: Uint8Array,
  packBytes: Uint8Array,
  evidence: Evidence,
): Promise<Uint8Array> {
  ensure(packBytes.length <= MAX_BYTES, "research pack exceeds 200 KB");
  const pack = JSON.parse(decoder.decode(packBytes));
  validatePack(pack, evidence);
  const zip = readZip(base);
  ensure(
    !zip.entries.some((e) => e.name.toLowerCase() === "research/pack.json"),
    "already personalised",
  );
  const entry = zip.entries.find((e) => e.name === "manifest.json");
  ensure(entry, "manifest missing");
  const manifest = JSON.parse(decoder.decode(await entryBytes(base, entry)));
  ensure(
    manifest.name === `mindmake-${PART}` && manifest.manifest_version === "0.3",
    "base is not the expected part",
  );
  const name = encoder.encode("research/pack.json"), crc = crc32(packBytes);
  const local = new Uint8Array(30 + name.length + packBytes.length),
    l = view(local);
  l.setUint32(0, 0x04034b50, true);
  l.setUint16(4, 20, true);
  l.setUint16(6, 0x800, true);
  l.setUint16(12, 33, true); // Stable 1980-01-01 ZIP date; builtAt lives in the pack.
  l.setUint32(14, crc, true);
  l.setUint32(18, packBytes.length, true);
  l.setUint32(22, packBytes.length, true);
  l.setUint16(26, name.length, true);
  local.set(name, 30);
  local.set(packBytes, 30 + name.length);
  const central = new Uint8Array(46 + name.length), c = view(central);
  c.setUint32(0, 0x02014b50, true);
  c.setUint16(4, 20, true);
  c.setUint16(6, 20, true);
  c.setUint16(8, 0x800, true);
  c.setUint16(14, 33, true);
  c.setUint32(16, crc, true);
  c.setUint32(20, packBytes.length, true);
  c.setUint32(24, packBytes.length, true);
  c.setUint16(28, name.length, true);
  c.setUint32(42, zip.centralOffset, true);
  central.set(name, 46);
  const end = new Uint8Array(22 + zip.comment.length), e = view(end);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, zip.entries.length + 1, true);
  e.setUint16(10, zip.entries.length + 1, true);
  e.setUint32(12, zip.centralSize + central.length, true);
  e.setUint32(16, zip.centralOffset + local.length, true);
  e.setUint16(20, zip.comment.length, true);
  end.set(zip.comment, 22);
  const chunks = [
    base.subarray(0, zip.centralOffset),
    local,
    base.subarray(zip.centralOffset, zip.centralOffset + zip.centralSize),
    central,
    end,
  ];
  const out = new Uint8Array(
    chunks.reduce((sum, chunk) => sum + chunk.length, 0),
  );
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  readZip(out);
  return out;
}
