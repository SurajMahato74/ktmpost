import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Users, 
  BarChart3, 
  Settings, 
  Tag,
  Eye,
  Plus,
  Calendar,
  Globe
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    end: true
  },
  {
    title: 'News Management',
    icon: FileText,
    children: [
      { title: 'All News', url: '/admin/news', icon: FileText },
      { title: 'Add News', url: '/admin/news/create', icon: Plus },
      { title: 'Featured News', url: '/admin/news/featured', icon: Eye },
    ]
  },
  {
    title: 'Video Management',
    icon: Video,
    children: [
      { title: 'All Videos', url: '/admin/videos', icon: Video },
      { title: 'Live Streams', url: '/admin/videos/live', icon: Globe },
      { title: 'Upload Video', url: '/admin/videos/upload', icon: Plus },
    ]
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: Tag
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    children: [
      { title: 'Overview', url: '/admin/analytics', icon: BarChart3 },
      { title: 'Visitors', url: '/admin/analytics/visitors', icon: Users },
      { title: 'Popular Content', url: '/admin/analytics/popular', icon: Eye },
    ]
  },
  {
    title: 'Content Schedule',
    url: '/admin/schedule',
    icon: Calendar
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-news rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KTM</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">KTMPost</h2>
                <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {navigationItems.map((item, index) => (
            <div key={index} className="mb-4">
              {item.children ? (
                <SidebarGroup>
                  <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium mb-2">
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-2" />
                      {!collapsed && item.title}
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.url}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={child.url}
                              className={({ isActive }) => getNavClasses(isActive)}
                            >
                              <child.icon className="w-4 h-4 mr-2" />
                              {!collapsed && <span>{child.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.end}
                        className={({ isActive }) => getNavClasses(isActive)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}