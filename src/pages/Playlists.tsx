
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, LineChart, Music, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";

// Music playlists grouped by mood
const moodPlaylists = [
  {
    mood: "Happy",
    description: "Uplifting music to boost your happiness and energy",
    playlists: [
      { name: "Feel-good classics", slug: "feel-good-classics", color: "bg-yellow-100", icon: "🎵" },
      { name: "Upbeat pop", slug: "upbeat-pop", color: "bg-orange-100", icon: "🎶" },
      { name: "Dance hits", slug: "dance-hits", color: "bg-red-100", icon: "💃" },
    ]
  },
  {
    mood: "Calm",
    description: "Soothing music to help you relax and find peace",
    playlists: [
      { name: "Gentle piano", slug: "gentle-piano", color: "bg-blue-100", icon: "🎹" },
      { name: "Acoustic ballads", slug: "acoustic-ballads", color: "bg-green-100", icon: "🎸" },
      { name: "Ambient sounds", slug: "soothing-ambient", color: "bg-teal-100", icon: "🌊" },
    ]
  },
  {
    mood: "Focused",
    description: "Music to help you concentrate and boost productivity",
    playlists: [
      { name: "Study beats", slug: "study-beats", color: "bg-purple-100", icon: "📚" },
      { name: "Deep focus", slug: "deep-focus", color: "bg-indigo-100", icon: "🧠" },
      { name: "Instrumental jazz", slug: "instrumental-jazz", color: "bg-slate-100", icon: "🎷" },
    ]
  },
  {
    mood: "Reflective",
    description: "Music for introspection and deep thinking",
    playlists: [
      { name: "Melancholy symphonies", slug: "melancholy-symphonies", color: "bg-violet-100", icon: "🎻" },
      { name: "Classical masterpieces", slug: "classical-masterpieces", color: "bg-rose-100", icon: "🎼" },
      { name: "Acoustic covers", slug: "acoustic-covers", color: "bg-emerald-100", icon: "🪕" },
    ]
  }
];

const Playlists = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]">
      {/* Header Navigation */}
      <header className="bg-white py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">MoodCraft</h1>
        <nav className="flex items-center space-x-8">
          <a href="/" className="flex items-center text-gray-700 hover:text-purple-600">
            <Home className="h-5 w-5 mr-1" />
            Home
          </a>
          <a onClick={() => navigate("/dashboard")} className="flex items-center text-gray-700 hover:text-purple-600 cursor-pointer">
            <LineChart className="h-5 w-5 mr-1" />
            Dashboard
          </a>
          <a onClick={() => navigate("/history")} className="flex items-center text-gray-700 hover:text-purple-600 cursor-pointer">
            <Calendar className="h-5 w-5 mr-1" />
            Mood History
          </a>
          <button className="flex items-center text-gray-700 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="flex items-center mb-8">
          <Music className="h-7 w-7 text-purple-600 mr-2" />
          <h1 className="text-3xl font-bold text-purple-800">Music Playlists</h1>
        </div>
        
        <p className="text-gray-600 mb-8 max-w-3xl">
          Music has a powerful effect on your mood and emotions. Browse our curated playlists designed to complement how you're feeling or help shift your mood in a positive direction.
        </p>
        
        {/* Playlists by Mood */}
        <div className="space-y-10">
          {moodPlaylists.map((moodGroup, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">{moodGroup.mood}</h2>
              <p className="text-gray-600 mb-4">{moodGroup.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {moodGroup.playlists.map((playlist, i) => (
                  <Card 
                    key={i} 
                    className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/play/${playlist.slug}`)}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-12 h-12 ${playlist.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {playlist.icon}
                      </div>
                      <h3 className="ml-3 text-lg font-medium">{playlist.name}</h3>
                    </div>
                    <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                      Play Now
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 border-t">
        MoodCraft - Your personal AI wellness guide
      </footer>

      {/* Background Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Playlists;
