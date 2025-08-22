import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewsFeatured() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Featured News</h1>
        <p className="text-muted-foreground">Manage featured news articles</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Featured News Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Featured news management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}