import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Bell className="size-8" />
          Notifications
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your notifications and alerts
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select className="flex-1 px-4 py-2 rounded-lg border border-border bg-background">
          <option>All Notifications</option>
          <option>Unread Only</option>
          <option>Alerts</option>
          <option>Updates</option>
          <option>System</option>
        </select>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notification Center</CardTitle>
            <CardDescription>
              You have 12 new notifications
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Trash2 className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Bell className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Notification management module - UI to be implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
