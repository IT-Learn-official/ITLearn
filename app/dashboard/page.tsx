export default function DashboardPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your Nighty scripts, performance, and activity will
            appear here.
          </p>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
        <p className="text-center text-muted-foreground text-sm">
          No dashboard data to show yet. Once we hook up analytics, you&apos;ll
          see stats about your scripts here.
        </p>
      </div>
    </div>
  );
}
