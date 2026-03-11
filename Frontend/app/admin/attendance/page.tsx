import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare2, Plus, Smile } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <CheckSquare2 className="size-8" />
          Attendance Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track and manage student attendance with face recognition
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button size="lg" className="h-24">
          <Smile className="size-6 mr-2" />
          <div>
            <div className="font-semibold">Face Recognition</div>
            <div className="text-xs opacity-90">Mark using camera</div>
          </div>
        </Button>
        <Button size="lg" variant="outline" className="h-24">
          <CheckSquare2 className="size-6 mr-2" />
          <div>
            <div className="font-semibold">Manual Entry</div>
            <div className="text-xs opacity-90">Enter manually</div>
          </div>
        </Button>
        <Button size="lg" variant="outline" className="h-24">
          <Plus className="size-6 mr-2" />
          <div>
            <div className="font-semibold">Reports</div>
            <div className="text-xs opacity-90">View analytics</div>
          </div>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>
            92% attendance rate (2,614 of 2,845 students)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckSquare2 className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Attendance tracking module - UI to be implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
