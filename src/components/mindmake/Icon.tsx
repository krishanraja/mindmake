import { ICONS, type IconName } from "@/lib/icons";

/** An icon from the site's one set (src/lib/icons.ts); decoration, so hidden from assistive technology. */
export function Icon({ name, className = "mm-icon" }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}
