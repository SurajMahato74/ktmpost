import { Clock, Eye, Play, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

const FeaturedNews = () => {
  const featuredStory = {
    title: "उतरी नाकाहरू बाढीपहिरोले प्रभावित, उद्धार कार्य तीव्र",
    excerpt: "बाढीपहिरोले प्रभावित क्षेत्रमा उद्धार कार्य तीव्र पारिएको छ। स्थानीय प्रशासनले प्रभावित परिवारहरूलाई सुरक्षित स्थानमा स्थानान्तरण गरेको छ।",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    category: "वातावरण",
    time: "२ घण्टा अगाडि",
    views: "१२.५ हजार"
  };

  const topSideNews = [
    {
      title: "अन्तर्राष्ट्रिय सम्मेलनको तयारी तीव्र",
      excerpt: "काठमाडौंमा अन्तर्राष्ट्रिय सम्मेलनको तयारी तीव्र गतिमा भइरहेको छ। विश्वभरका नेताहरू सहभागी हुनेछन्।",
      image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg",
      category: "राजनीति",
      time: "३ घण्टा अगाडि"
    },
    {
      title: "नयाँ मेडिकल कलेजको शुभारम्भ",
      excerpt: "पूर्वी नेपालमा नयाँ मेडिकल कलेज सञ्चालनमा आएको छ। यो क्षेत्रको स्वास्थ्य सेवामा सुधार ल्याउनेछ।",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
      category: "स्वास्थ्य",
      time: "५ घण्टा अगाडि"
    },
    {
      title: "काठमाडौंमा सडक विस्तार योजना",
      excerpt: "काठमाडौंको सडक विस्तार योजनाले ट्राफिक जाम कम गर्न सहयोग पुग्ने अपेक्षा गरिएको छ।",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
      category: "अर्थतन्त्र",
      time: "६ घण्टा अगाडि"
    },
    {
      title: "प्रविधि प्रदर्शनीको आयोजन",
      excerpt: "नयाँ प्रविधि प्रदर्शनीले स्थानीय नवाचारलाई प्रोत्साहन गर्नेछ। उद्घाटन समारोह भव्य हुने अपेक्षा।",
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
      category: "प्रविधि",
      time: "८ घण्टा अगाडि"
    },
    // Added dummy news items below
    {
      title: "शिक्षा क्षेत्रमा नयाँ सुधार कार्यक्रम घोषणा",
      excerpt: "सरकारले शिक्षा क्षेत्रमा सुधारका लागि नयाँ कार्यक्रम घोषणा गरेको छ।",
      image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg",
      category: "शिक्षा",
      time: "९ घण्टा अगाडि"
    },
    {
      title: "कृषि उत्पादनमा वृद्धि",
      excerpt: "यस वर्ष कृषि उत्पादनमा उल्लेखनीय वृद्धि भएको छ।",
      image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "कृषि",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "सूचना प्रविधिमा नयाँ आविष्कार",
      excerpt: "सूचना प्रविधिमा नयाँ आविष्कारले देशलाई डिजिटल बनाउने अपेक्षा।",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      category: "सूचना प्रविधि",
      time: "११ घण्टा अगाडि"
    },
    {
      title: "सामाजिक सेवामा स्वयंसेवकको योगदान",
      excerpt: "स्वयंसेवकहरूले सामाजिक सेवामा उल्लेखनीय योगदान पुर्याएका छन्।",
      image: "https://images.pexels.com/photos/664691/pexels-photo-664691.jpeg",
      category: "सामाजिक सेवा",
      time: "१२ घण्टा अगाडि"
    }
  ];

  const sideNews = [
    {
      title: "काठमाडौं अन्तर्राष्ट्रिय सांस्कृतिक महोत्सवको तयारी",
      category: "संस्कृति",
      time: "६ घण्टा अगाडि"
    },
    {
      title: "पोखरामा प्रविधि नवाचार केन्द्र स्थापना",
      category: "प्रविधि",
      time: "८ घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "राष्ट्रिय फुटबल टोली एसियन कपको प्रारम्भिक चरणमा छनोट",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि"
    },
    {
      title: "ग्रामीण समुदायमा स्वास्थ्य सुधारको सकारात्मक प्रभाव",
      category: "स्वास्थ्य",
      time: "१२ घण्टा अगाडि"
    },
    {
      title: "नेपालमा जलवायु परिवर्तनको प्रभाव न्यूनीकरणका लागि नयाँ पहल",
      category: "वातावरण",
      time: "१४ घण्टा अगाडि"
    }
  ];

  const mainHighlights = [
    {
      title: "नेपालमा पर्यटन प्रवर्द्धनका नयाँ योजना",
      excerpt: "सरकारले पर्यटन प्रवर्द्धनका लागि नयाँ योजना सार्वजनिक गरेको छ। यसले विदेशी पर्यटक आकर्षित गर्ने अपेक्षा।",
      image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      category: "पर्यटन",
      time: "१ घण्टा अगाडि",
      views: "५ हजार"
    },
    {
      title: "शिक्षा क्षेत्रमा डिजिटल प्रविधिको प्रयोग",
      excerpt: "विद्यालयहरूमा डिजिटल प्रविधिको प्रयोग बढ्दै गएको छ। यसले शिक्षण सिकाइमा सहजता ल्याएको छ।",
      image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg",
      category: "शिक्षा",
      time: "२ घण्टा अगाडि",
      views: "३ हजार"
    },
    {
      title: "कृषि क्षेत्रमा नवप्रवर्तन",
      excerpt: "कृषि क्षेत्रमा नवप्रवर्तनले किसानहरूको जीवनस्तरमा सुधार ल्याएको छ।",
      image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "कृषि",
      time: "३ घण्टा अगाडि",
      views: "२ हजार"
    },
    // Add 9 more dummy news items below
    {
      title: "स्वास्थ्य क्षेत्रमा नयाँ नीति",
      excerpt: "स्वास्थ्य क्षेत्रमा नयाँ नीति लागू गरिएको छ।",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
      category: "स्वास्थ्य",
      time: "४ घण्टा अगाडि",
      views: "१ हजार"
    },
    {
      title: "राजनीतिक समिक्षा",
      excerpt: "राजनीतिक समिक्षामा नयाँ विचारहरू प्रस्तुत।",
      image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg",
      category: "राजनीति",
      time: "५ घण्टा अगाडि",
      views: "८ सय"
    },
    {
      title: "प्रविधिमा नवप्रवर्तन",
      excerpt: "नवप्रवर्तनले प्रविधिमा नयाँ युगको सुरुवात।",
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
      category: "प्रविधि",
      time: "६ घण्टा अगाडि",
      views: "७ सय"
    },
    
    {
      title: "खेलकुदमा सफलता",
      excerpt: "खेलकुदमा नेपाली टोलीको सफलता।",
      image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      category: "खेलकुद",
      time: "१० घण्टा अगाडि",
      views: "३ सय"
    },
    {
      title: "जलवायु परिवर्तन",
      excerpt: "जलवायु परिवर्तनको असर र समाधान।",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      category: "वातावरण",
      time: "११ घण्टा अगाडि",
      views: "२ सय"
    },
    {
      title: "शिक्षामा सुधार",
      excerpt: "शिक्षामा सुधारका लागि नयाँ योजना।",
      image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg",
      category: "शिक्षा",
      time: "१२ घण्टा अगाडि",
      views: "१ सय"
    }
  ];



  const videos = [
    {
      title: "काठमाडौंबाट लाइव प्रसारण",
      thumbnail: "https://images.pexels.com/photos/3568518/pexels-photo-3568518.jpeg",
      type: "लाइव",
      viewers: "१.२ हजार",
      time: "लाइव"
    },
    {
      title: "आजको मुख्य समाचार",
      thumbnail: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg",
      type: "समाचार",
      time: "२ घण्टा अगाडि"
    },
    {
      title: "खेलकुद समाचार",
      thumbnail: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      type: "खेलकुद",
      time: "४ घण्टा अगाडि"
    },
    {
      title: "सांस्कृतिक समाचार",
      thumbnail: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
      type: "संस्कृति",
      time: "५ घण्टा अगाडि"
    }
  ];
const [showAllUpdates, setShowAllUpdates] = useState(false);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Section: Three Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        {/* Top Side News - Column 1 */}
        <div className="lg:col-span-3 flex flex-col order-2 lg:order-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">अपडेट्स</h3>
           {topSideNews.length > 6 && (
              <button
                className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                onClick={() => setShowAllUpdates((prev) => !prev)}
              >
                {showAllUpdates ? "कम देखाउनुहोस्" : "थप हेर्नुहोस्"} <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            {(showAllUpdates ? topSideNews : topSideNews.slice(0, 6)).map((news, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-4 rounded-lg">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {news.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Featured Stories - Column 2 */}
        <div className="lg:col-span-6 flex flex-col order-1 lg:order-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">विशेष समाचार</h3>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4 flex-grow">
            {[featuredStory, featuredStory].map((story, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden rounded">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="bg-red-600 px-2 py-1 rounded-full text-xs font-medium">
                      {story.category}
                    </span>
                    <h2 className="text-lg font-bold mt-2 leading-tight line-clamp-2">
                      {story.title}
                    </h2>
                    <p className="text-sm text-gray-200 mt-1 line-clamp-3">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-200 mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {story.time}
                      <Eye className="w-3 h-3 ml-2 mr-1" />
                      {story.views}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Videos - Column 3 */}
        <div className="lg:col-span-3 flex flex-col order-3 lg:order-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">लाइव प्रसारण</h3>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4 flex-grow">
            {videos.slice(0, 4).map((video, index) => (
              <div key={index} className="relative aspect-video bg-black rounded overflow-hidden group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-red-600 transition-colors">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      video.type === 'लाइव' ? 'bg-red-600' : 'bg-gray-600'
                    } text-white`}
                  >
                    {video.type}
                  </span>
                  <h4 className="text-white font-medium mt-1 line-clamp-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-300 mt-1">
                    {video.viewers ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        {video.viewers} दर्शक
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        {video.time}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Highlights and Side News */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Highlights - 3 columns */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">मुख्य समाचार</h3>
                <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                  थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainHighlights.map((news, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden mb-4 rounded-lg">
                      {news.image && (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
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

            {/* Side News */}
            <div className="lg:col-span-1">
              <div className="p-4 border-l-4 border-red-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">शीर्ष समाचार</h3>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                    थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="space-y-4">
                  {sideNews.map((news, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer pb-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {news.time}
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-red-600 transition-colors mt-1">
                        {news.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;