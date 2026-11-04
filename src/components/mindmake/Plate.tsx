import type { ReactNode } from "react";

/**
 * Where a section begins (Krish, 2026-11-04: "I can't tell where a new section
 * actually begins"): a full-width picture with the section's heading on it.
 * The picture is decoration; the heading is the section's name.
 */
export function Plate({ media, children }: { media: ReactNode; children: ReactNode }) {
  return (
    <div className="mm-plate">
      <div className="mm-plate-media" aria-hidden="true">{media}</div>
      <div className="mm-plate-head mm-container">{children}</div>
    </div>
  );
}
