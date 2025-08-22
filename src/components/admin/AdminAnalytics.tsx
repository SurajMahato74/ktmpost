import React, { useState } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const visitorData = [
  { name: 'Jan', visitors: 4000, pageViews: 8000, bounceRate: 35 },
  { name: 'Feb', visitors: 3000, pageViews: 6000, bounceRate: 42 },
  { name: 'Mar', visitors: 5000, pageViews: 10000, bounceRate: 28 },
  { name: 'Apr', visitors: 4500, pageViews: 9000, bounceRate: 31 },
  { name: 'May', visitors: 6000, pageViews: 12000, bounceRate: 25 },
  { name: 'Jun', visitors: 5500, pageViews: 11000, bounceRate: 29 },
  { name: 'Jul', visitors: 7000, pageViews: 14000, bounceRate: 22 }
];

const topPagesData = [
  { name: 'Home', visits: 15420, percentage: 35 },
  { name: 'Breaking News', visits: 8930, percentage: 20 },
  { name: 'Sports', visits: 6750, percentage: 15 },
  { name: 'Politics', visits: 4680, percentage: 11 },
  { name: 'Entertainment', visits: 3240, percentage: 8 },
  { name: 'Others', visits: 4980, percentage: 11 }
];

const deviceData = [
  { name: 'Desktop', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 40, color: 'hsl(var(--news-red))' },
  { name: 'Tablet', value: 15, color: 'hsl(var(--success))' }
];

const realtimeData = [
  { time: '9:00', users: 234 },
  { time: '9:15', users: 345 },
  { time: '9:30', users: 567 },
  { time: '9:45', users: 432 },
  { time: '10:00', users: 678 },
  { time: '10:15', users: 543 },
  { time: '10:30', users: 789 }
];

const topArticles = [
  {
    title: 'उत्तरी नाकाहरू बाढीपहिरोले प्रभावित',
    views: '12,340',
    shares: '234',
    comments: '89',
    engagement: '+15.2%'
  },
  {
    title: 'नयाँ आर्थिक नीति घोषणा',
    views: '8,920',
    shares: '156',
    comments: '67',
    engagement: '+8.7%'
  },
  {
    title: 'शिक्षा क्षेत्रमा सुधार',
    views: '6,780',
    shares: '123',
    comments: '45',
    engagement: '+12.3%'
  },
  {
    title: 'खेलकुद उपलब्धि',
    views: '5,430',
    shares: '98',
    comments: '34',
    engagement: '+6.8%'
  }
];

export function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your website performance and visitor insights</p>
        </div>
        <div className="flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">45,231</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                  <span className="text-xs text-success font-medium">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">89,430</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                  <span className="text-xs text-success font-medium">+8.1%</span>
                </div>
              </div>
              <div className="p-3 bg-news-red/10 rounded-lg">
                <Eye className="w-6 h-6 text-news-red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">24.5%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-success rotate-180" />
                  <span className="text-xs text-success font-medium">-3.2%</span>
                </div>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Globe className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold">3m 24s</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                  <span className="text-xs text-success font-medium">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
            <CardDescription>Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stackId="1"
                  stroke="hsl(var(--news-red))" 
                  fill="hsl(var(--news-red))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitor device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 bg-success rounded-full mr-2 animate-pulse"></div>
              Real-time Users
            </CardTitle>
            <CardDescription>Current active users on site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-success">789</p>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={realtimeData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPagesData.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">{index + 1}</div>
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.visits.toLocaleString()} visits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-10">{page.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Articles</CardTitle>
          <CardDescription>Articles with highest engagement this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{article.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {article.views} views
                    </div>
                    <div>
                      {article.shares} shares
                    </div>
                    <div>
                      {article.comments} comments
                    </div>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {article.engagement}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}