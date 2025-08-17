import React from 'react';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-700 to-red-600 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-2 order-1 text-center md:text-left lg:col-span-1">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <h3 className="text-3xl font-bold text-white">केटीएम</h3>
              <h3 className="text-3xl font-bold text-gray-900 ml-2">पोस्ट</h3>
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
              {['गृहपृष्ठ', 'राजनीति', 'अर्थतन्त्र', 'खेलकुद', 'मनोरञ्जन', 'विचार'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="relative text-gray-200 hover:text-yellow-300 transition-colors group"
                  >
                    {link}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1 order-3 text-center md:text-left lg:col-span-1">
            <h4 className="font-bold text-lg mb-4 text-white">श्रेणीहरू</h4>
            <ul className="space-y-2">
              {['राष्ट्रिय समाचार', 'अन्तर्राष्ट्रिय', 'प्रविधि', 'स्वास्थ्य', 'शिक्षा', 'संस्कृति'].map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className="relative text-gray-200 hover:text-yellow-300 transition-colors group"
                  >
                    {category}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
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
            <div className="mt-4">
              <h5 className="font-medium mb-2 text-white">कार्यालय समय</h5>
              <p className="text-gray-200 text-sm">सोम - शुक्र: बिहान ९:०० - साँझ ६:००</p>
              <p className="text-gray-200 text-sm">२४/७ समाचार कभरेज</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-800 bg-red-800/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-200 text-sm">
              © २०८१ केटीएम पोस्ट। सबै अधिकार सुरक्षित।
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;