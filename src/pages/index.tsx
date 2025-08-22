import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Newspaper, Video, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-news-red/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-news rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">KTM</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            KTMPost Admin Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive content management system for Nepal's leading news platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/admin">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transform transition-transform">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Dashboard</CardTitle>
                <CardDescription>Overview & Analytics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/news">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transform transition-transform">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Newspaper className="w-6 h-6 text-news-red" />
                </div>
                <CardTitle className="text-lg">News Management</CardTitle>
                <CardDescription>Article Publishing</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/videos">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transform transition-transform">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-lg">Video Content</CardTitle>
                <CardDescription>Live Streams & Videos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transform transition-transform">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>Performance Insights</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="text-center">
          <Link to="/admin">
            <Button size="lg" className="bg-gradient-news text-lg px-8 py-6 h-auto">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Enter Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">Content Management</h3>
              <p className="text-muted-foreground text-sm">
                Create, edit, and publish news articles with rich media support
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Live Broadcasting</h3>
              <p className="text-muted-foreground text-sm">
                Stream live news, manage video content, and engage with viewers
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Track visitor engagement, content performance, and growth metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;