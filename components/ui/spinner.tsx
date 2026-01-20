import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, size, ...props }: React.ComponentProps<"svg"> & { size?: number }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  )
}

export { Spinner }
