export default function DashboardPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
        <p className="text-center text-muted-foreground text-sm">
          Mauris et ipsum vitae justo auctor semper in quis sapien. Suspendisse
          nec sollicitudin nulla.
        </p>
      </div>
    </div>
  );
}
