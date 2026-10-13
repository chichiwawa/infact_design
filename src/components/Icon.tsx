import type { IconName } from "@/lib/sections";

const paths: Record<IconName, React.ReactNode> = {
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>,
  blueprint: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M10 10v10M14 4v6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  chart: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16l4-5 3 3 5-7" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  sparkles: <><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><path d="M19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" /></>,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></>,
  blog: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4M9 12h6M9 16h6" /></>,
  viral: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  group: <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M15.5 15c2.8.3 5 2.4 5 5" /></>,
  ad: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15l2.5-6 2.5 6M7.8 13h3.4M15 9v6M15 9h1.5a2 2 0 010 4H15" /></>,
  design: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M13 8l3 3" /></>,
};

export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? paths.sparkles}
    </svg>
  );
}
