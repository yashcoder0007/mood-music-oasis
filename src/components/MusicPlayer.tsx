
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX, Pause, Play, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useMoodEntries } from "@/hooks/useMoodEntries";

// More reliable audio sources (free audio from mixkit.co)
const songs = {
  calm: [
    { 
      name: "Dreamy Meditation",
      url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" 
    },
    { 
      name: "Serenity",
      url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3" 
    },
    {
      name: "Calm Morning",
      url: "https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3"
    }
  ],
  focus: [
    { 
      name: "Deep Focus",
      url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" 
    },
    { 
      name: "Concentration",
      url: "https://assets.mixkit.co/music/preview/mixkit-morning-mood-614.mp3" 
    },
    {
      name: "Study Mode",
      url: "https://assets.mixkit.co/music/preview/mixkit-just-chill-16.mp3"
    }
  ],
  happy: [
    { 
      name: "Upbeat Mood",
      url: "https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3" 
    },
    {
      name: "Happy Day",
      url: "https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3"
    },
    {
      name: "Joy",
      url: "https://assets.mixkit.co/music/preview/mixkit-cherry-pop-99.mp3"
    }
  ],
  lofi: [
    {
      name: "Lofi Chill",
      url: "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3"
    },
    {
      name: "Lofi Study",
      url: "https://assets.mixkit.co/music/preview/mixkit-silent-descent-614.mp3"
    },
    {
      name: "Lofi Relax",
      url: "https://assets.mixkit.co/music/preview/mixkit-comforting-piano-beat-709.mp3"
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
  const { data: moodEntries } = useMoodEntries();

  // Get the latest mood entry to suggest music
  useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      const latestMood = moodEntries[0].mood;
      
      // Map mood to music category
      let suggestedCategory = "lofi"; // default
      
      if (["Happy", "Excited", "Joyful"].includes(latestMood)) {
        suggestedCategory = "happy";
      } else if (["Sad", "Depressed", "Down"].includes(latestMood)) {
        suggestedCategory = "calm";
      } else if (["Focused", "Productive", "Determined"].includes(latestMood)) {
        suggestedCategory = "focus";
      }
      
      // Only change if it's different to avoid restarting current music
      if (suggestedCategory !== currentCategory && !playing) {
        setCurrentCategory(suggestedCategory);
        setCurrentTrackIndex(0);
      }
    }
  }, [moodEntries, currentCategory, playing]);

  // Auto-play music when component mounts
  useEffect(() => {
    const autoPlayTrack = songs.lofi[0];
    loadAndPlaySong(autoPlayTrack.url, autoPlayTrack.name, false); // Start paused
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(muted ? 0 : volume);
    }
  }, [volume, muted]);

  const loadAndPlaySong = (url: string, name: string, autoplay: boolean = true) => {
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
      autoplay: autoplay,
      onload: () => {
        console.log("Music loaded successfully:", name);
        if (autoplay) {
          toast({
            title: "Now Playing",
            description: name,
          });
          setPlaying(true);
        }
      },
      onloaderror: (id, error) => {
        console.error("Error loading music:", error);
        toast({
          title: "Music Error",
          description: "Could not load track. Trying next one...",
          variant: "destructive",
        });
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
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background dark:bg-gray-800 p-3 rounded-full shadow-md transition-all hover:shadow-lg duration-300">
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
          className="h-9 w-9 rounded-full bg-accent dark:bg-accent"
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
      
      <div className="hidden xl:block px-2 min-w-[100px] text-xs text-center font-medium text-foreground dark:text-foreground truncate">
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
