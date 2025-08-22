import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VideosUpload() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-muted-foreground">Upload and manage video content</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Video Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Video upload interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}