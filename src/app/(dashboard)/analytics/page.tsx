import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your QR code performance
        </p>
      </div>

      {/* Upgrade Banner */}
      <Card className="p-8 glass mb-8 border-primary/30">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <ChartIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Unlock Analytics</h2>
            <p className="text-muted-foreground">
              Upgrade to Pro to access detailed scan analytics, including location data, device breakdown, and time-based insights.
            </p>
          </div>
          <a href="/#pricing" className="shrink-0">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Upgrade to Pro
            </button>
          </a>
        </div>
      </Card>

      {/* Preview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 opacity-50">
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Total Scans</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Unique Visitors</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Top Country</p>
          <p className="text-3xl font-bold">-</p>
        </Card>
      </div>

      {/* Preview Chart */}
      <Card className="p-6 glass opacity-50">
        <h3 className="text-lg font-semibold mb-4">Scans Over Time</h3>
        <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Chart preview unavailable on Free plan</p>
        </div>
      </Card>
    </div>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
