import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ChevronRight } from 'lucide-react';

const settingsSections = [
  {
    icon: '👤',
    title: 'Profile Settings',
    description: 'Update your personal information',
    href: '/dashboard/settings/profile',
  },
  {
    icon: '🏫',
    title: 'College Settings',
    description: 'Manage institution details and configuration',
    href: '/dashboard/settings/college',
  },
  {
    icon: '🔌',
    title: 'Integrations',
    description: 'Connect external services and tools',
    href: '/dashboard/settings/integrations',
  },
  {
    icon: '🔐',
    title: 'Security & Privacy',
    description: 'Manage security settings and permissions',
    href: '/dashboard/settings/security',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="size-8" />
          Settings
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account and system settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{section.icon}</div>
                  <div>
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>
            Global settings for your College ERP instance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <input type="checkbox" defaultChecked className="size-5" />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Enhance account security
              </p>
            </div>
            <input type="checkbox" className="size-5" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Data Backup</p>
              <p className="text-sm text-muted-foreground">
                Auto-backup system data
              </p>
            </div>
            <input type="checkbox" defaultChecked className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and dangerous actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
