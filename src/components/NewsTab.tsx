import React, { useState } from 'react';
import { Clock, Eye, ArrowRight } from 'lucide-react';

const NewsTab = () => {
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  const categories = [
    { name: 'सबै', active: true },
    { name: 'राजनीति', active: false },
    { name: 'अर्थतन्त्र', active: false },
    { name: 'खेलकुद', active: false },
    { name: 'मनोरञ्जन', active: false },
    { name: 'प्रविधि', active: false },
  ];

  const newsList = [
    "परम्परागत कला महोत्सवले नेपालको सांस्कृतिक सम्पदालाई प्रदर्शन गर्यो",
    "ग्रामीण क्षेत्रमा नयाँ स्याटेलाइट इन्टरनेट सेवा सुरु",
    "स्वास्थ्य सुधारले ग्रामीण समुदायमा सकारात्मक प्रभाव पारेको छ",
    "शिक्षा क्षेत्रमा डिजिटल नेपाल पहलको प्रगति",
    "नयाँ हाइड्रोपावर प्रोजेक्टले ऊर्जा उत्पादनमा वृद्धि",
    "कृषि क्षेत्रमा आधुनिक प्रविधिको प्रयोग बढ्दो",
    "पर्यटन क्षेत्रमा रोजगारीका नयाँ अवसरहरू",
    "वन संरक्षण कार्यक्रमले वातावरणीय सुधार ल्यायो",
    "युवाहरूका लागि सीप विकास कार्यक्रम विस्तार",
    "स्थानीय उत्पादनलाई बढावा दिने नीति कार्यान्वयन",
    "सामुदायिक स्वास्थ्य केन्द्रहरूमा सेवा विस्तार",
    "महिला उद्यमीहरूका लागि विशेष सहुलियत कार्यक्रम",
    "खानेपानी आपूर्तिमा गुणात्मक सुधार",
    "यातायात व्यवस्थापनमा नयाँ प्रविधिको प्रयोग",
    "सहकारी संस्थाहरूको भूमिकामा वृद्धि",
    "नयाँ सडक निर्माणले ग्रामीण क्षेत्रमा सम्पर्क सुधार",
    "जलवायु परिवर्तनविरुद्ध नयाँ नीति घोषणा",
    "स्थानीय बजारमा जैविक उत्पादनको माग बढ्दो",
    "शैक्षिक संस्थाहरूमा डिजिटल कक्षाको विस्तार",
    "स्वच्छ ऊर्जा परियोजनाहरूमा लगानी वृद्धि",
    "साना उद्यमीहरूलाई सहुलियत ऋणको व्यवस्था",
  ];

  const updates = [
    {
      title: "उतरी नाका हवाइपहिरोले प्रभावित, यात्रुहरू अलपत्र",
      excerpt: "भारी वर्षाले नाकामा पहिरो गएपछि यात्रुहरू अलपत्र परेका छन्।",
      category: "अपडेट",
      time: "१ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      title: "अनामनगरमा सवारी दुर्घटना, समातिए तीर्थ हस्तान्तरण",
      excerpt: "सवारी दुर्घटनामा परी दुई जना घाइते भएका छन्।",
      category: "अपडेट",
      time: "२ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    },
    {
      title: "पहिचान पञ्चासे, वनजंगलको कनाली रजमगर",
      excerpt: "स्थानीय वनजंगलको संरक्षणमा नयाँ पहल सुरु भएको छ।",
      category: "अपडेट",
      time: "३ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    },
    {
      title: "नेप्से परिसूचकमा दोहोरो अंकको",
      excerpt: "बजारमा सकारात्मक संकेत देखिएको छ।",
      category: "अपडेट",
      time: "४ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg",
    },
     {
      title: "उतरी नाका हवाइपहिरोले प्रभावित, यात्रुहरू अलपत्र",
      excerpt: "भारी वर्षाले नाकामा पहिरो गएपछि यात्रुहरू अलपत्र परेका छन्।",
      category: "अपडेट",
      time: "१ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      title: "अनामनगरमा सवारी दुर्घटना, समातिए तीर्थ हस्तान्तरण",
      excerpt: "सवारी दुर्घटनामा परी दुई जना घाइते भएका छन्।",
      category: "अपडेट",
      time: "२ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    },
    {
      title: "पहिचान पञ्चासे, वनजंगलको कनाली रजमगर",
      excerpt: "स्थानीय वनजंगलको संरक्षणमा नयाँ पहल सुरु भएको छ।",
      category: "अपडेट",
      time: "३ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    },
    {
      title: "नेप्से परिसूचकमा दोहोरो अंकको",
      excerpt: "बजारमा सकारात्मक संकेत देखिएको छ।",
      category: "अपडेट",
      time: "४ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg",
    },
     {
      title: "पहिचान पञ्चासे, वनजंगलको कनाली रजमगर",
      excerpt: "स्थानीय वनजंगलको संरक्षणमा नयाँ पहल सुरु भएको छ।",
      category: "अपडेट",
      time: "३ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    },
    {
      title: "नेप्से परिसूचकमा दोहोरो अंकको",
      excerpt: "बजारमा सकारात्मक संकेत देखिएको छ।",
      category: "अपडेट",
      time: "४ घण्टा अगाडि",
      image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg",
    },
  ];

  const additionalNews = [
    {
      title: "काठमाडौंमा नयाँ मेट्रो रेल परियोजना घोषणा",
      image: "https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg",
      time: "५ घण्टा अगाडि",
      category: "यातायात",
      excerpt: "काठमाडौंमा नयाँ मेट्रो रेल परियोजनाले यातायातमा क्रान्ति ल्याउने अपेक्षा गरिएको छ।",
      views: "१.२K",
    },
    {
      title: "नेपालको पर्यटन क्षेत्रमा विदेशी लगानी वृद्धि",
      image: "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg",
      time: "६ घण्टा अगाडि",
      category: "पर्यटन",
      excerpt: "विदेशी लगानीले नेपालको पर्यटन क्षेत्रमा नयाँ अवसरहरू सिर्जना गरेको छ।",
      views: "९००",
    },
    {
      title: "स्थानीय किसानहरूलाई नयाँ बाली प्रविधि प्रशिक्षण",
      image: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
      time: "७ घण्टा अगाडि",
      category: "कृषि",
      excerpt: "नयाँ प्रविधिले किसानहरूको उत्पादकत्व बढाउने अपेक्षा गरिएको छ।",
      views: "७५०",
    },
    {
      title: "जलवायु परिवर्तनले हिमाली क्षेत्रमा असर",
      image: "https://images.pexels.com/photos/147411/pexels-photo-147411.jpeg",
      time: "८ घण्टा अगाडि",
      category: "वातावरण",
      excerpt: "हिमाली क्षेत्रमा जलवायु परिवर्तनको प्रभाव गम्भीर बन्दै गएको छ।",
      views: "१.५K",
    },
    {
      title: "नयाँ शिक्षा नीतिले विद्यार्थीहरूलाई लाभ",
      image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
      time: "९ घण्टा अगाडि",
      category: "शिक्षा",
      excerpt: "नयाँ नीतिले विद्यार्थीहरूलाई आधुनिक शिक्षामा पहुँच प्रदान गर्नेछ।",
      views: "१.१K",
    },
    {
      title: "काठमाडौंमा स्मार्ट सिटी परियोजनाको सुरुवात",
      image: "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg",
      time: "१० घण्टा अगाडि",
      category: "विकास",
      excerpt: "स्मार्ट सिटी परियोजनाले काठमाडौंलाई आधुनिक शहर बनाउने लक्ष्य राखेको छ।",
      views: "२.०K",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 font-medium transition-all ${
                  category.active
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Main News and Additional News */}
          <div className="lg:col-span-2">
            {/* Main News Section */}
            <div className="bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                उत्तरी नाकाहरू बाढीपहिरोले बिथोलिँदा खलबलिँदै व्यापारक्रम
              </h2>
              <div className="relative mb-4">
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                  alt="Main News"
                  className="w-full h-72 object-cover rounded-lg"
                />
              </div>
              <p className="text-gray-700 leading-relaxed">
                सुमनथली नाका टप्प भएसँगै चिनियाँ, आइतबारका कन्टेनर फिर्ता
                हुँदा तातोपानीको ‘रि-रूट’ गरिएको छ तर पहिरोले तातोपानी नाकामा
                पनि अवरोध हुँदा चाडबाडका लागि भित्र्याउनुपर्ने सामान कहिले आइपुग्ने
                टुङ्गो छैन।
              </p>
              <p className="text-sm text-red-600 mt-2">रिपोर्टर: त्रिपाठी</p>
            </div>

            {/* Additional News Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">मुख्य समाचार</h3>
                <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                  थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalNews.map((news, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden mb-4 rounded-lg">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {news.time}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Related News (सम्बन्धित समाचार) */}
          <div className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                सम्बन्धित समाचार
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent ml-4"></div>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {updates.map((update, index) => (
                <div key={index} className="flex flex-col cursor-pointer group">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
                    <img
                      src={update.image}
                      alt={update.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {update.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {update.time}
                  </div>
                </div>
              ))}
            </div>
            </div>
        </div>

        {/* News List */}
        <div className="bg-white border-t-4 border-red-600 p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              ताजा समाचार
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent ml-4"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsList.map((news, index) => (
              <div
                key={index}
                className="group cursor-pointer py-3 border-b border-gray-100 hover:border-red-200 transition-colors"
              >
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors leading-relaxed">
                      {news}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.floor(Math.random() * 12) + 1} घण्टा अगाडि
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md">
              थप समाचार हेर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTab;