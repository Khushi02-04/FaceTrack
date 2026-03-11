import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Plus } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="size-8" />
          Reports & Documents
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Generate and manage system reports
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select className="flex-1 px-4 py-2 rounded-lg border border-border bg-background">
          <option>All Report Types</option>
          <option>Attendance Reports</option>
          <option>Academic Reports</option>
          <option>Financial Reports</option>
          <option>Student Performance</option>
        </select>
        <Button>
          <Plus className="size-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Generated reports from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Monthly Attendance Summary - February 2026',
              'Academic Performance Analysis - Q4 2025',
              'Student Enrollment Report - Current Semester',
              'Faculty Workload Distribution - 2026',
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{report}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
