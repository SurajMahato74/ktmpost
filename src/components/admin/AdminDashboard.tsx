import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Video, 
  TrendingUp, 
  Eye,
  Clock,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const statsData = [
  {
    title: 'Total Visitors',
    value: '45,231',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Published Articles',
    value: '1,234',
    change: '+5.2%',
    trend: 'up',
    icon: FileText,
    color: 'text-news-red',
    bgColor: 'bg-news-red/10'
  },
  {
    title: 'Live Videos',
    value: '23',
    change: '+18.0%',
    trend: 'up',
    icon: Video,
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  {
    title: 'Page Views',
    value: '89,430',
    change: '+8.1%',
    trend: 'up',
    icon: Eye,
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  }
];

const trafficData = [
  { name: 'Jan', visitors: 4000, pageViews: 8000 },
  { name: 'Feb', visitors: 3000, pageViews: 6000 },
  { name: 'Mar', visitors: 5000, pageViews: 10000 },
  { name: 'Apr', visitors: 4500, pageViews: 9000 },
  { name: 'May', visitors: 6000, pageViews: 12000 },
  { name: 'Jun', visitors: 5500, pageViews: 11000 },
  { name: 'Jul', visitors: 7000, pageViews: 14000 }
];

const recentNews = [
  {
    id: '1',
    title: 'उत्तरी नाकाहरू बाढीपहिरोले प्रभावित',
    status: 'published',
    author: 'सिता',
    views: '2.3K',
    time: '2 hours ago'
  },
  {
    id: '2',
    title: 'नयाँ आर्थिक नीति घोषणा',
    status: 'draft',
    author: 'राम',
    views: '0',
    time: '1 hour ago'
  },
  {
    id: '3',
    title: 'शिक्षा क्षेत्रमा सुधार',
    status: 'published',
    author: 'गीता',
    views: '1.8K',
    time: '4 hours ago'
  },
  {
    id: '4',
    title: 'खेलकुद उपलब्धि',
    status: 'scheduled',
    author: 'श्याम',
    views: '0',
    time: 'Tomorrow 9:00 AM'
  }
];

const liveVideos = [
  {
    id: '1',
    title: 'आजको मुख्य समाचार',
    viewers: 342,
    status: 'live',
    duration: '45 min'
  },
  {
    id: '2',
    title: 'राजनीतिक विश्लेषण',
    viewers: 156,
    status: 'live',
    duration: '23 min'
  }
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to KTMPost Admin Panel</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-news">
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Go Live
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-success" />
                    <span className="text-xs text-success font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitors and page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="hsl(var(--primary))" />
                <Bar dataKey="pageViews" fill="hsl(var(--news-red))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Article engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent News Articles</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground line-clamp-1">
                      {news.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                      <span>By {news.author}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {news.views}
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {news.time}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      news.status === 'published' ? 'default' :
                      news.status === 'draft' ? 'secondary' :
                      'outline'
                    }
                  >
                    {news.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Live Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-gradient-news text-white">
                      🔴 LIVE
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {video.duration}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">
                    {video.title}
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-3 h-3 mr-1" />
                    {video.viewers} viewers
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Start New Stream
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}