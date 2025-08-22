import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VideosLive() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Streams</h1>
        <p className="text-muted-foreground">Manage live video streams</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Live Stream Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Live stream management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}