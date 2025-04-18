
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX, Pause, Play, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useMoodEntries } from "@/hooks/useMoodEntries";

// More reliable audio sources from Free Music Archive and other free sources
const songs = {
  calm: [
    { 
      name: "Peaceful Meditation",
      url: "https://cdn.freesound.org/previews/515/515363_2454582-lq.mp3" 
    },
    { 
      name: "Serenity",
      url: "https://cdn.freesound.org/previews/463/463449_4094606-lq.mp3" 
    },
    {
      name: "Tranquil Waters",
      url: "https://cdn.freesound.org/previews/620/620602_1648170-lq.mp3"
    }
  ],
  focus: [
    { 
      name: "Concentration",
      url: "https://cdn.freesound.org/previews/587/587636_5674468-lq.mp3" 
    },
    { 
      name: "Deep Focus",
      url: "https://cdn.freesound.org/previews/560/560636_1089955-lq.mp3" 
    },
    {
      name: "Study Mode",
      url: "https://cdn.freesound.org/previews/518/518500_11019257-lq.mp3"
    }
  ],
  happy: [
    { 
      name: "Upbeat Mood",
      url: "https://cdn.freesound.org/previews/475/475838_5407806-lq.mp3" 
    },
    {
      name: "Happy Day",
      url: "https://cdn.freesound.org/previews/415/415101_8199784-lq.mp3"
    },
    {
      name: "Joy",
      url: "https://cdn.freesound.org/previews/479/479035_10538900-lq.mp3"
    }
  ],
  lofi: [
    {
      name: "Lofi Chill",
      url: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3"
    },
    {
      name: "Lofi Study",
      url: "https://cdn.freesound.org/previews/635/635658_5674468-lq.mp3"
    },
    {
      name: "Lofi Relax",
      url: "https://cdn.freesound.org/previews/588/588449_13279153-lq.mp3"
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
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

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

  // Initialize music player when component mounts
  useEffect(() => {
    const initializeTrack = songs.lofi[0];
    loadAndPlaySong(initializeTrack.url, initializeTrack.name, false);
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(muted ? 0 : volume);
    }
  }, [volume, muted]);

  const loadAndPlaySong = (url: string, name: string, autoplay: boolean = true) => {
    setLoading(true);
    
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    
    setCurrentTrackName(name);
    
    // Create a new Howl instance with the song
    try {
      soundRef.current = new Howl({
        src: [url],
        html5: true,
        loop: true,
        volume: muted ? 0 : volume,
        autoplay: autoplay,
        onload: () => {
          console.log("Music loaded successfully:", name);
          setLoading(false);
          setErrorCount(0);
          if (autoplay) {
            toast({
              title: "Now Playing",
              description: name,
            });
            setPlaying(true);
          }
        },
        onloaderror: () => {
          console.error("Error loading music:", url);
          setLoading(false);
          setErrorCount(prev => prev + 1);
          
          // If we've had too many errors, show a toast notification
          if (errorCount >= 2) {
            toast({
              title: "Music Error",
              description: "Having trouble loading music. Please try again later.",
              variant: "destructive",
            });
            setPlaying(false);
            return;
          }
          
          // Try another track if this one fails
          toast({
            title: "Switching Tracks",
            description: "Could not load track. Trying another one...",
            variant: "default",
          });
          nextTrack();
        },
        onplay: () => setPlaying(true),
        onpause: () => setPlaying(false),
        onend: () => nextTrack()
      });
    } catch (error) {
      console.error("Error creating Howl instance:", error);
      setLoading(false);
      toast({
        title: "Music Error",
        description: "Could not initialize audio player.",
        variant: "destructive",
      });
    }
  };

  const togglePlay = () => {
    if (!soundRef.current || loading) return;
    
    try {
      if (playing) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
      toast({
        title: "Playback Error",
        description: "Could not control playback. Trying to reload track...",
        variant: "destructive",
      });
      
      // Attempt to reload the current track
      const track = songs[currentCategory as keyof typeof songs][currentTrackIndex];
      loadAndPlaySong(track.url, track.name);
    }
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMutedState = !muted;
    setMuted(newMutedState);
    
    try {
      soundRef.current.volume(newMutedState ? 0 : volume);
    } catch (error) {
      console.error("Error toggling mute state:", error);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (soundRef.current && !muted) {
      try {
        soundRef.current.volume(newVolume);
      } catch (error) {
        console.error("Error changing volume:", error);
      }
    }
  };

  const nextTrack = () => {
    try {
      const category = songs[currentCategory as keyof typeof songs];
      const nextIndex = (currentTrackIndex + 1) % category.length;
      setCurrentTrackIndex(nextIndex);
      const nextTrack = category[nextIndex];
      loadAndPlaySong(nextTrack.url, nextTrack.name);
    } catch (error) {
      console.error("Error loading next track:", error);
      toast({
        title: "Playback Error",
        description: "Could not load next track.",
        variant: "destructive",
      });
    }
  };

  const prevTrack = () => {
    try {
      const category = songs[currentCategory as keyof typeof songs];
      const prevIndex = (currentTrackIndex - 1 + category.length) % category.length;
      setCurrentTrackIndex(prevIndex);
      const prevTrack = category[prevIndex];
      loadAndPlaySong(prevTrack.url, prevTrack.name);
    } catch (error) {
      console.error("Error loading previous track:", error);
      toast({
        title: "Playback Error",
        description: "Could not load previous track.",
        variant: "destructive",
      });
    }
  };

  const changeCategory = (category: string) => {
    if (category === currentCategory || loading) return;
    
    try {
      setCurrentCategory(category as keyof typeof songs);
      setCurrentTrackIndex(0);
      const newTrack = songs[category as keyof typeof songs][0];
      loadAndPlaySong(newTrack.url, newTrack.name);
    } catch (error) {
      console.error("Error changing music category:", error);
      toast({
        title: "Category Error",
        description: "Could not change music category.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background dark:bg-gray-800 p-3 rounded-full shadow-md transition-all hover:shadow-lg duration-300">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={prevTrack}
          disabled={loading}
          className="h-8 w-8 rounded-full"
        >
          <SkipBack size={16} />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={togglePlay}
          disabled={loading}
          className="h-9 w-9 rounded-full bg-accent dark:bg-accent relative"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : playing ? (
            <Pause size={18} />
          ) : (
            <Play size={18} />
          )}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={nextTrack}
          disabled={loading}
          className="h-8 w-8 rounded-full"
        >
          <SkipForward size={16} />
        </Button>
      </div>
      
      <div className="hidden xl:block px-2 min-w-[100px] text-xs text-center font-medium text-foreground dark:text-foreground truncate">
        {loading ? "Loading..." : currentTrackName}
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleMute}
          disabled={loading}
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
          disabled={loading}
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
            disabled={loading}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
