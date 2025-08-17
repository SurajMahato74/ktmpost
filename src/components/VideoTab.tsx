import React from 'react';
import { Play, Clock, Eye, Calendar, Radio, Tv } from 'lucide-react';

const VideoTab = () => {
  const liveStreams = [
    {
      id: 1,
      title: "प्रत्यक्ष: संसदीय बैठक - बजेट छलफल",
      thumbnail: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      viewers: "२.३ हजार",
      isLive: true
    },
    {
      id: 2,
      title: "प्रत्यक्ष: साँझको समाचार बुलेटिन",
      thumbnail: "https://images.pexels.com/photos/3740390/pexels-photo-3740390.jpeg",
      viewers: "१.८ हजार",
      isLive: true
    }
  ];

  const videos = [
    {
      id: 1,
      title: "विशेष अन्तर्वार्ता: अर्थमन्त्रीसँग आर्थिक नीतिबारे",
      thumbnail: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
      duration: "२४:१५",
      views: "४५ हजार",
      time: "२ घण्टा अगाडि",
      category: "राजनीति"
    },
    {
      title: "वृत्तचित्र: नेपालका परम्परागत चाडपर्वहरू",
      thumbnail: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
      duration: "४२:३०",
      views: "३२ हजार",
      time: "१ दिन अगाडि",
      category: "संस्कृति"
    },
    {
      title: "खेल हाइलाइट: राष्ट्रिय च्याम्पियनसिप फाइनल",
      thumbnail: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
      duration: "१८:४५",
      views: "६७ हजार",
      time: "२ दिन अगाडि",
      category: "खेलकुद"
    },
    {
      title: "प्रविधि कुराकानी: डिजिटल नेपाल पहलको प्रगति",
      thumbnail: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
      duration: "३१:२०",
      views: "२८ हजार",
      time: "३ दिन अगाडि",
      category: "प्रविधि"
    },
    {
      title: "व्यापार आज: बजार विश्लेषण र प्रवृत्ति",
      thumbnail: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
      duration: "२६:१०",
      views: "१९ हजार",
      time: "४ दिन अगाडि",
      category: "अर्थतन्त्र"
    },
    {
      title: "स्वास्थ्य फोकस: नेपालमा आधुनिक चिकित्सा सुविधा",
      thumbnail: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
      duration: "३५:२५",
      views: "४१ हजार",
      time: "५ दिन अगाडि",
      category: "स्वास्थ्य"
    }
  ];

  const scheduleItems = [
    { time: "६:०० बजे", program: "साँझको समाचार", type: "प्रत्यक्ष" },
    { time: "७:०० बजे", program: "राजनीतिक बहस", type: "प्रत्यक्ष" },
    { time: "८:३० बजे", program: "सांस्कृतिक कार्यक्रम", type: "प्रत्यक्ष" },
    { time: "९:३० बजे", program: "खेल समाचार", type: "प्रत्यक्ष" }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Live Streams Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Radio className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              प्रत्यक्ष प्रसारण
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="relative bg-white overflow-hidden group cursor-pointer border-l-4 border-blue-600 hover:border-blue-700 transition-colors">
                <div className="relative aspect-video">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-medium flex items-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    प्रत्यक्ष
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 text-sm">
                    <Eye className="w-4 h-4 inline mr-1" />
                    {stream.viewers}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {stream.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-6">
              <Tv className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                भिडियो समाचार
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent ml-4"></div>
            </div>
            
            <div className="space-y-6">
              {videos.map((video, index) => (
                <div key={index} className="bg-white border-l-4 border-blue-600 hover:border-blue-700 transition-colors group cursor-pointer">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 aspect-video flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-blue-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
                          {video.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {video.time}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views} हेराइ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                थप भिडियो हेर्नुहोस्
              </button>
            </div>
          </div>

          {/* Schedule Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border-l-4 border-blue-600 p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-bold text-gray-900">आजको कार्यक्रम</h3>
              </div>
              <div className="space-y-4">
                {scheduleItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{item.program}</div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                    <span className="bg-red-100 text-red-600 px-2 py-1 text-xs">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Videos */}
            <div className="bg-white border-l-4 border-blue-600 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">यस हप्ता लोकप्रिय</h3>
              <div className="space-y-4">
                {videos.slice(0, 4).map((video, index) => (
                  <div key={index} className="flex items-center space-x-3 group cursor-pointer">
                    <div className="relative w-16 h-12 flex-shrink-0 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">
                        {video.views} हेराइ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTab;