import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axios'; // Import shared axios instance

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/login/', {
        username,
        password,
      });
      if (response.data.message === 'Login successful') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('लगइन सफल भयो!');
        navigate('/admin');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.non_field_errors || 'अमान्य प्रयोगकर्ता नाम वा पासवर्ड';
      toast.error(errorMessage);
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700/10 to-red-600/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">केटीएम</h1>
            <h1 className="text-3xl font-bold text-white ml-2">पोस्ट</h1>
          </div>
          <p className="text-center text-sm text-yellow-300 font-medium">एडमिन ड्यासबोर्ड लगइन</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                प्रयोगकर्ता नाम
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50"
                  required
                  placeholder="प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्"
                />
              </div>
            </div>
            <div className="mb-5">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                पासवर्ड
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50"
                  required
                  placeholder="पासवर्ड प्रविष्ट गर्नुहोस्"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-red-700 to-red-600 text-white font-bold rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300"
            >
              लगइन
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            पासवर्ड बिर्सनुभयो?{' '}
            <a href="#" className="text-red-600 hover:text-red-700 font-medium transition-colors">
              रिसेट गर्नुहोस्
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;