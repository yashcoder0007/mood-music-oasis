import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, LineChart, ArrowLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Howl } from "howler";
import MusicPlayer from "@/components/MusicPlayer";

const playlists = {
  "gentle-piano": {
    name: "Gentle Piano",
    description: "Soothing piano melodies to calm your mind and relax your body.",
    tracks: [
      { name: "Peaceful Morning", length: "3:45", src: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3" },
      { name: "Rainy Day Reflections", length: "4:20", src: "https://cdn.freesound.org/previews/651/651713_5674468-lq.mp3" },
      { name: "Moonlight Sonata", length: "5:10", src: "https://cdn.freesound.org/previews/368/368332_1676145-lq.mp3" },
    ],
    color: "bg-blue-50",
    textColor: "text-blue-800",
  },
  "acoustic-ballads": {
    name: "Acoustic Ballads",
    description: "Heartfelt acoustic songs that touch your soul and calm your mind.",
    tracks: [
      { name: "Mountain Road", length: "4:12", src: "https://cdn.freesound.org/previews/635/635586_14159485-lq.mp3" },
      { name: "Starry Night", length: "3:50", src: "https://cdn.freesound.org/previews/612/612117_5674468-lq.mp3" },
      { name: "Sunset Drive", length: "4:45", src: "https://cdn.freesound.org/previews/583/583545_7616568-lq.mp3" },
    ],
    color: "bg-green-50",
    textColor: "text-green-800",
  },
  "melancholy-symphonies": {
    name: "Melancholy Symphonies",
    description: "Embrace your emotions with these beautiful melancholy compositions.",
    tracks: [
      { name: "Winter's Tale", length: "5:23", src: "https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3" },
      { name: "Rainy Memories", length: "4:15", src: "https://cdn.freesound.org/previews/344/344430_1676145-lq.mp3" },
      { name: "Quiet Reflection", length: "6:05", src: "https://cdn.freesound.org/previews/368/368326_1676145-lq.mp3" },
    ],
    color: "bg-purple-50",
    textColor: "text-purple-800",
  },
  "soothing-ambient": {
    name: "Soothing Ambient",
    description: "Ambient sounds to create a peaceful atmosphere and calm your thoughts.",
    tracks: [
      { name: "Ocean Waves", length: "6:12", src: "https://cdn.freesound.org/previews/517/517407_11019257-lq.mp3" },
      { name: "Forest Dreams", length: "5:30", src: "https://cdn.freesound.org/previews/398/398715_7552264-lq.mp3" },
      { name: "Gentle Rain", length: "7:45", src: "https://cdn.freesound.org/previews/419/419827_230356-lq.mp3" },
    ],
    color: "bg-teal-50",
    textColor: "text-teal-800",
  }
};

const MusicPlaylist = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playlist = slug && playlists[slug as keyof typeof playlists] 
    ? playlists[slug as keyof typeof playlists] 
    : null;

  const currentTrack = playlist?.tracks[currentTrackIndex];

  useEffect(() => {
    if (!currentTrack?.src) return;
    
    if (sound) {
      sound.stop();
      sound.unload();
    }
    
    const newSound = new Howl({
      src: [currentTrack.src],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => handleNext(),
      onload: () => {
        setDuration(newSound.duration());
      }
    });
    
    setSound(newSound);
    
    return () => {
      if (newSound) {
        newSound.stop();
        newSound.unload();
      }
    };
  }, [currentTrackIndex, slug]);

  useEffect(() => {
    if (!sound || !isPlaying) return;
    
    const progressInterval = setInterval(() => {
      if (sound.playing()) {
        setProgress(sound.seek());
      }
    }, 1000);
    
    return () => clearInterval(progressInterval);
  }, [sound, isPlaying]);

  const togglePlayPause = () => {
    if (!sound) return;
    
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(playlist?.tracks.length ? playlist.tracks.length - 1 : 0);
    }
  };

  const handleNext = () => {
    if (playlist?.tracks && currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (!sound) return;
    
    const seekValue = value[0];
    sound.seek(seekValue);
    setProgress(seekValue);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FD]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Playlist Not Found</h2>
          <Button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]">
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className={`${playlist.color} ${playlist.textColor} p-8 rounded-xl mb-8`}>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="mb-4">{playlist.description}</p>
          <p className="text-sm">{playlist.tracks.length} tracks</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tracks</h2>
          
          <div className="space-y-4">
            {playlist.tracks.map((track, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50
                  ${currentTrackIndex === index ? 'bg-purple-50 border border-purple-200' : ''}
                `}
                onClick={() => {
                  setCurrentTrackIndex(index);
                }}
              >
                <div className="flex items-center">
                  <div className="mr-4 w-8 text-center text-gray-500">
                    {currentTrackIndex === index && isPlaying ? (
                      <div className="flex space-x-1 justify-center">
                        <div className="w-1 h-3 bg-purple-600 animate-pulse"></div>
                        <div className="w-1 h-4 bg-purple-600 animate-pulse"></div>
                        <div className="w-1 h-2 bg-purple-600 animate-pulse"></div>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${currentTrackIndex === index ? 'text-purple-800' : 'text-gray-800'}`}>
                      {track.name}
                    </p>
                  </div>
                </div>
                <div className="text-gray-500">{track.length}</div>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="p-6 sticky bottom-4 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`w-16 h-16 ${playlist.color} rounded-md flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-semibold">{currentTrack?.name}</p>
                <p className="text-sm text-gray-500">{playlist.name}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center max-w-md w-full">
              <div className="flex items-center space-x-4 mb-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevious}
                  className="rounded-full"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={togglePlayPause}
                  className="bg-purple-600 hover:bg-purple-700 h-12 w-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNext}
                  className="rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center w-full space-x-2">
                <span className="text-xs text-gray-500 w-10 text-right">
                  {formatTime(progress)}
                </span>
                <Slider
                  className="w-full"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={[progress]}
                  onValueChange={handleSeek}
                />
                <span className="text-xs text-gray-500 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <footer className="text-center py-6 text-gray-500 border-t">
        MoodCraft - Your personal AI wellness guide
      </footer>
      
      <MusicPlayer />
    </div>
  );
};

export default MusicPlaylist;
