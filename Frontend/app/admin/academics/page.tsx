import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, Search } from 'lucide-react';

export default function AcademicsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <GraduationCap className="size-8" />
          Academics Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage courses, classes, and subjects
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by course, class, or subject..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academics Structure</CardTitle>
          <CardDescription>
            Courses: 12 | Classes: 48 | Subjects: 156
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GraduationCap className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Academics management module - UI to be implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
