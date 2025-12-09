import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 glass mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-1 bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
      </Card>

      {/* Subscription Section */}
      <Card className="p-6 glass mb-6">
        <h2 className="text-lg font-semibold mb-4">Subscription</h2>
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
          <div>
            <p className="font-medium">Free Plan</p>
            <p className="text-sm text-muted-foreground">
              Basic features with static QR codes
            </p>
          </div>
          <a href="/#pricing">
            <Button>Upgrade to Pro</Button>
          </a>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Current Usage</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Static QR Codes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0 / 0</p>
              <p className="text-sm text-muted-foreground">Dynamic QR Codes</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 glass border-red-500/20">
        <h2 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
