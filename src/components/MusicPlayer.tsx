
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX, Pause, Play, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const songs = {
  calm: [
    { 
      name: "Gentle Ocean",
      url: "https://cdn.freesound.org/previews/417/417850_5121236-lq.mp3" 
    },
    { 
      name: "Peaceful Piano",
      url: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3" 
    },
    {
      name: "Morning Mist",
      url: "https://cdn.freesound.org/previews/419/419431_8521274-lq.mp3"
    }
  ],
  focus: [
    { 
      name: "Study Beats",
      url: "https://cdn.freesound.org/previews/635/635586_14159485-lq.mp3" 
    },
    { 
      name: "Deep Focus",
      url: "https://cdn.freesound.org/previews/612/612117_5674468-lq.mp3" 
    },
    {
      name: "Concentration",
      url: "https://cdn.freesound.org/previews/638/638073_13029356-lq.mp3"
    }
  ],
  happy: [
    { 
      name: "Upbeat Acoustic",
      url: "https://cdn.freesound.org/previews/583/583545_7616568-lq.mp3" 
    },
    {
      name: "Happy Vibes",
      url: "https://cdn.freesound.org/previews/527/527741_9882872-lq.mp3"
    },
    {
      name: "Cheerful Tune",
      url: "https://cdn.freesound.org/previews/266/266566_5002908-lq.mp3"
    }
  ],
  lofi: [
    {
      name: "Lofi Beat",
      url: "https://cdn.freesound.org/previews/615/615299_5495243-lq.mp3"
    },
    {
      name: "Chill Vibes",
      url: "https://cdn.freesound.org/previews/524/524796_11235851-lq.mp3"
    },
    {
      name: "Lofi Rain",
      url: "https://cdn.freesound.org/previews/630/630089_6404678-lq.mp3"
    }
  ]
};

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("lofi");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState("");
  const soundRef = useRef<Howl | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create music player with first lofi song by default for autoplay
    const defaultSong = songs.lofi[0];
    loadAndPlaySong(defaultSong.url, defaultSong.name);
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(muted ? 0 : volume);
    }
  }, [volume, muted]);

  const loadAndPlaySong = (url: string, name: string) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    
    setCurrentTrackName(name);
    
    soundRef.current = new Howl({
      src: [url],
      html5: true,
      loop: true,
      volume: muted ? 0 : volume,
      autoplay: true,
      onload: () => {
        console.log("Music loaded successfully");
        toast({
          title: "Now Playing",
          description: name,
        });
        setPlaying(true);
      },
      onloaderror: () => {
        console.error("Error loading music:", url);
        toast({
          title: "Music Error",
          description: "Could not load track. Trying next one...",
          variant: "destructive",
        });
        // Try next song as fallback
        nextTrack();
      },
      onplay: () => {
        setPlaying(true);
      },
      onpause: () => {
        setPlaying(false);
      },
      onend: () => {
        nextTrack();
      }
    });
  };

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMutedState = !muted;
    setMuted(newMutedState);
    soundRef.current.volume(newMutedState ? 0 : volume);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (soundRef.current && !muted) {
      soundRef.current.volume(newVolume);
    }
  };

  const nextTrack = () => {
    const category = songs[currentCategory as keyof typeof songs];
    const nextIndex = (currentTrackIndex + 1) % category.length;
    setCurrentTrackIndex(nextIndex);
    const nextTrack = category[nextIndex];
    loadAndPlaySong(nextTrack.url, nextTrack.name);
  };

  const prevTrack = () => {
    const category = songs[currentCategory as keyof typeof songs];
    const prevIndex = (currentTrackIndex - 1 + category.length) % category.length;
    setCurrentTrackIndex(prevIndex);
    const prevTrack = category[prevIndex];
    loadAndPlaySong(prevTrack.url, prevTrack.name);
  };

  const changeCategory = (category: string) => {
    if (category === currentCategory) return;
    
    setCurrentCategory(category as keyof typeof songs);
    setCurrentTrackIndex(0);
    const newTrack = songs[category as keyof typeof songs][0];
    loadAndPlaySong(newTrack.url, newTrack.name);
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md transition-all hover:shadow-lg duration-300">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={prevTrack}
          className="h-8 w-8 rounded-full"
        >
          <SkipBack size={16} />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={togglePlay}
          className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={nextTrack}
          className="h-8 w-8 rounded-full"
        >
          <SkipForward size={16} />
        </Button>
      </div>
      
      <div className="hidden xl:block px-2 min-w-[100px] text-xs text-center font-medium text-gray-600 dark:text-gray-300 truncate">
        {currentTrackName}
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleMute}
          className="h-8 w-8 rounded-full"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        
        <Slider
          className="w-20"
          defaultValue={[volume]}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
        />
      </div>

      <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
        {(["lofi", "calm", "focus", "happy"] as const).map((category) => (
          <Button 
            key={category}
            size="sm" 
            variant={currentCategory === category ? "default" : "outline"}
            className="text-xs h-7 px-2"
            onClick={() => changeCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
