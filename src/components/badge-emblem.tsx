import type { LucideIcon } from "lucide-react";

const HEXAGON =
  "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]";

export function BadgeEmblem({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      aria-hidden="true"
      className={`grid size-14 shrink-0 place-items-center bg-primary ${HEXAGON}`}
    >
      <div
        className={`grid size-12 place-items-center bg-background ${HEXAGON}`}
      >
        <Icon className="size-6 text-primary" />
      </div>
    </div>
  );
}
