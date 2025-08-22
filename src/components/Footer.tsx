import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import logoimage from '../asstes/logo.png';

// Category interface
interface Category {
  id: number;
  name: string;
  nameEnglish: string;
  description: string;
  color: string;
  icon: string;
  subcategories: any[];
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  articlesCount: number;
  order: number;
  createdAt: string;
}

const Footer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Category[]>('categories/');
      // Filter only active categories and sort by order
      const activeCategories = response.data
        .filter((category) => category.isActive)
        .sort((a, b) => a.order - b.order);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to static categories if API fails
      setCategories([
        { id: 1, name: 'राष्ट्रिय समाचार', nameEnglish: 'National News', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 1, createdAt: '' },
        { id: 2, name: 'अन्तर्राष्ट्रिय', nameEnglish: 'International', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 2, createdAt: '' },
        { id: 3, name: 'प्रविधि', nameEnglish: 'Technology', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 3, createdAt: '' },
        { id: 4, name: 'स्वास्थ्य', nameEnglish: 'Health', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 4, createdAt: '' },
        { id: 5, name: 'शिक्षा', nameEnglish: 'Education', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 5, createdAt: '' },
        { id: 6, name: 'संस्कृति', nameEnglish: 'Culture', description: '', color: '', icon: '', subcategories: [], seoTitle: '', seoDescription: '', isActive: true, articlesCount: 0, order: 6, createdAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Quick Links with corresponding routes
  const quickLinks = [
    { name: 'गृहपृष्ठ', path: '/' },
    { name: 'राजनीति', path: '/category/राजनीति' },
    { name: 'अर्थतन्त्र', path: '/category/अर्थतन्त्र' },
    { name: 'खेलकुद', path: '/category/खेलकुद' },
    { name: 'मनोरञ्जन', path: '/category/मनोरञ्जन' },
    { name: 'विचार', path: '/category/विचार' },
  ];

  // Handle navigation for quick links and categories
  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-r from-red-700 to-red-600 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-2 order-1 text-center md:text-left lg:col-span-1">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src={logoimage} 
                alt="KTM Post Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed text-sm mx-auto max-w-md md:max-w-none">
              काठमाडौंको अग्रणी डिजिटल समाचार प्लेटफर्म, नेपाल र विश्वभरका प्रामाणिक र समयमै समाचार प्रदान गर्दै।
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 order-2 text-center md:text-left lg:col-span-1">
            <h4 className="font-bold text-lg mb-4 text-white">द्रुत लिङ्कहरू</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className="relative text-gray-200 hover:text-yellow-300 transition-colors group"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1 order-3 text-center md:text-left lg:col-span-1">
            <h4 className="font-bold text-lg mb-4 text-white">श्रेणीहरू</h4>
            {loading ? (
              <p className="text-gray-200 text-sm">Loading categories...</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleLinkClick(`/category/${encodeURIComponent(category.name)}`)}
                      className="relative text-gray-200 hover:text-yellow-300 transition-colors group"
                    >
                      {category.name}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Info */}
          <div className="col-span-2 order-4 text-center md:text-left lg:col-span-1">
            <h4 className="font-bold text-lg mb-4 text-white">सम्पर्क ठेगाना</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                <span className="text-gray-200">काठमाडौं, नेपाल</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <Phone className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                <span className="text-gray-200">+९७७-१-४४४४४४४</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <Mail className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                <span className="text-gray-200">info@ktmpost.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-800 bg-red-800/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <p className="text-gray-200 text-sm mb-2 md:mb-0">
              © २०८१ केटीएम पोस्ट। सबै अधिकार सुरक्षित।
            </p>
            <div className="flex flex-col items-center md:flex-row md:space-x-6">
              <div className="flex space-x-6 mb-2 md:mb-0">
                {['गोपनीयता नीति', 'सेवाका सर्तहरू', 'कुकी नीति'].map((policy) => (
                  <a
                    key={policy}
                    href="#"
                    className="relative text-gray-200 hover:text-yellow-300 text-sm transition-colors group"
                  >
                    {policy}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
                <a
                  href="/ktmpost/login"
                  className="relative text-gray-200 hover:text-yellow-300 text-sm transition-colors group"
                >
                  Admin
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <p className="text-gray-200 text-sm text-center">
                Engineered By: <a href="https://nirc.com.np/" target="_blank" className="hover:underline">National Incubation & Research Center</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;