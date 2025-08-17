import React from 'react';
import { AlertCircle } from 'lucide-react';

const BreakingNews = () => {
  const breakingNews = [
    "प्रधानमन्त्रीले साना व्यवसायका लागि नयाँ आर्थिक प्याकेजको घोषणा गरे",
    "काठमाडौं उपत्यकामा वायु गुणस्तरमा उल्लेखनीय सुधार",
    "नयाँ जलविद्युत आयोजनाले नेपालको ऊर्जा क्षेत्रलाई बलियो बनाउने",
    "ग्रामीण क्षेत्रका लागि प्रमुख पूर्वाधार विकास स्वीकृत"
  ];

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center transform -translate-y-1 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <AlertCircle className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="font-bold text-base text-yellow-300">ब्रेकिङ</span>
          </div>
          <div className="flex overflow-hidden ml-4">
            <div className="flex animate-marquee whitespace-nowrap">
              {breakingNews.map((news, index) => (
                <span key={index} className="mx-8 text-sm font-medium">
                  {news}
                </span>
              ))}
              {breakingNews.map((news, index) => (
                <span key={`duplicate-${index}`} className="mx-8 text-sm font-medium">
                  {news}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default BreakingNews;