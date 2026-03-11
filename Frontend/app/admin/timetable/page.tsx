import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export default function TimetablePage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="size-8" />
          Timetable Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Create and manage class schedules
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select className="flex-1 px-4 py-2 rounded-lg border border-border bg-background">
          <option>All Classes</option>
          <option>Class 10-A</option>
          <option>Class 10-B</option>
          <option>Class 11-A</option>
        </select>
        <Button>
          <Plus className="size-4 mr-2" />
          Create Timetable
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Timetables</CardTitle>
          <CardDescription>
            Total classes with timetable: 48
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Timetable management module - UI to be implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
