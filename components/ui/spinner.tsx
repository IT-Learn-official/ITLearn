import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

function Spinner({
  className,
  strokeWidth,
  ...props
}: React.ComponentProps<"svg">) {
  const resolvedStrokeWidth =
    typeof strokeWidth === "number" ? strokeWidth : 2;

  return (
    <HugeiconsIcon
      aria-label="Bezig met laden"
      className={cn("size-4 animate-spin", className)}
      icon={Loading03Icon}
      role="status"
      strokeWidth={resolvedStrokeWidth}
      {...props}
    />
  );
}


export { Spinner };
