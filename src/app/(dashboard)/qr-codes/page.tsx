import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function QRCodesPage() {
  const supabase = await createClient();

  // TODO: Fetch QR codes from database
  const qrCodes: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your QR codes
          </p>
        </div>
        <Link href="/qr-codes/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            New QR Code
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {qrCodes.length === 0 && (
        <Card className="p-12 glass text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <QRIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No QR codes yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first QR code to get started. You can generate codes for URLs, WiFi networks, contact cards, and more.
          </p>
          <Link href="/qr-codes/new">
            <Button size="lg">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Your First QR Code
            </Button>
          </Link>
        </Card>
      )}

      {/* QR Codes Grid */}
      {qrCodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="p-4 glass">
              {/* QR Code card content will go here */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function QRIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  );
}
