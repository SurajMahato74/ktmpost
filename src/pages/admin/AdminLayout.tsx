import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axios'; // Import shared axios instance

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Checking auth, token:', token);
    if (!token) {
      console.warn('No auth token found in localStorage');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.get('check-auth/');
      console.log('Check-auth response:', response.data);
      if (!response.data.isAuthenticated) {
        console.warn('User not authenticated:', response.data);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err: any) {
      console.error('Auth check error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'प्रमाणीकरण असफल भयो। कृपया पुन: लगइन गर्नुहोस्।');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('logout/');
      console.log('Logout successful');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.success('लगआउट सफल भयो!');
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err.response?.data || err.message);
      toast.error('लगआउट असफल भयो!');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  useEffect(() => {
    console.log('AdminLayout mounted, checking auth');
    checkAuth();
  }, []); // Empty dependency array to run only on mount

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="text-sidebar-foreground" />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="खोज्नुहोस्..." className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-news-red">3</Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/avatars/admin.jpg"
                        alt="Admin"
                        onError={(e) => {
                          e.currentTarget.src = '/avatars/fallback.jpg';
                          console.warn('Failed to load avatar image');
                        }}
                      />
                      <AvatarFallback>{user.username?.charAt(0)?.toUpperCase() || 'AD'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.username || 'Admin User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.is_superuser ? 'Superuser' : user.role || 'Admin'} |{' '}
                      {user.username ? `${user.username}@ktmpost.com` : 'admin@ktmpost.com'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>प्रोफाइल</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>सेटिङहरू</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>लगआउट</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}