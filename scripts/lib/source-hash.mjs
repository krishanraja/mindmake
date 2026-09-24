// Historical manifests keep their original text/binary classification. New
// formats require an explicit manifest opt-in; binary assets remain byte-exact.
export function sourceHashBytes(path, content, manifest) {
  const text = /\.(?:[cm]?[jt]sx?|css|html|json|ya?ml|md|txt)$/.test(path)
    || path === '.vercelignore'
    || (manifest.additionalTextExtensions ?? []).some(extension => path.endsWith(extension));
  return manifest.textLineEndings === 'lf' && text
    ? Buffer.from(content.toString('utf8').replace(/\r\n/g, '\n')) : content;
}
