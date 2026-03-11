import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, Upload, Search } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Folder className="size-8" />
          Documents Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Store and manage institutional documents
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>
        <Button>
          <Upload className="size-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Total documents: 245 | Total size: 2.4 GB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Folder className="size-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Document management module - UI to be implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
