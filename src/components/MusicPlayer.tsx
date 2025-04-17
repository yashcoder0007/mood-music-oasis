
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Create the lofi music player with a gentler song
    soundRef.current = new Howl({
      src: ["https://dl.dropboxusercontent.com/s/x2q43ayw85ygenn/gentle-ocean-waves.mp3"], // Gentle ocean waves with soft piano
      html5: true,
      loop: true,
      volume: volume,
      onload: () => {
        console.log("Music loaded successfully");
      },
      onloaderror: (id, error) => {
        console.error("Error loading music:", error);
        // Fallback to another gentle lofi song
        soundRef.current = new Howl({
          src: ["https://cdn.freesound.org/previews/597/597849_11861866-lq.mp3"],
          html5: true,
          loop: true,
          volume: volume
        });
      }
    });

    // Auto-play with user interaction (to comply with browser autoplay policies)
    const handleUserInteraction = () => {
      if (soundRef.current && !playing) {
        soundRef.current.play();
        setPlaying(true);
        // Remove the event listeners once played
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
      }
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
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
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-full shadow-md">
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
