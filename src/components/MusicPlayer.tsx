import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
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
    }
  ],
  happy: [
    { 
      name: "Upbeat Acoustic",
      url: "https://cdn.freesound.org/previews/583/583545_7616568-lq.mp3" 
    }
  ]
};

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create music player with first calm song by default
    const defaultSong = songs.calm[0];
    soundRef.current = new Howl({
      src: [defaultSong.url],
      html5: true,
      loop: true,
      volume: volume,
      onload: () => {
        console.log("Music loaded successfully");
        toast({
          title: "Music Ready",
          description: `Now playing: ${defaultSong.name}`,
        });
      },
      onloaderror: (id, error) => {
        console.error("Error loading music:", error);
        toast({
          title: "Music Error",
          description: "Could not load music. Trying alternative source...",
          variant: "destructive",
        });
        // Try next song in calm category as fallback
        if (songs.calm.length > 1) {
          soundRef.current = new Howl({
            src: [songs.calm[1].url],
            html5: true,
            loop: true,
            volume: volume
          });
        }
      }
    });

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

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={togglePlay}
        className="h-8 w-8 rounded-full"
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      
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
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
