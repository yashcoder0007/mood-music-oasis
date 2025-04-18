
import { useState, useEffect } from 'react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  notes: string;
  created_at: string;
  music_played?: string[];
  actions?: string[];
}

export function useMoodEntries() {
  const [data, setData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEntries = () => {
      try {
        setIsLoading(true);
        const storedEntries = localStorage.getItem('moodEntries');
        
        if (storedEntries) {
          try {
            const parsedEntries = JSON.parse(storedEntries);
            // Validate that we have an array
            if (Array.isArray(parsedEntries)) {
              setData(parsedEntries);
            } else {
              console.warn("Stored mood entries is not an array, initializing with empty array");
              setData([]);
            }
          } catch (parseError) {
            console.error("Error parsing mood entries:", parseError);
            setData([]);
          }
        } else {
          // Initialize with empty array if no entries exist
          setData([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading mood entries:', err);
        setError(err instanceof Error ? err : new Error('Failed to load mood entries'));
        setIsLoading(false);
      }
    };

    loadEntries();

    // Set up event listener to refresh when local storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'moodEntries') {
        loadEntries();
      }
    };

    // Custom event for cases where localStorage is updated in the same window
    const handleCustomStorage = () => {
      loadEntries();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('moodEntriesUpdate', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('moodEntriesUpdate', handleCustomStorage);
    };
  }, []);

  // Function to add a new mood entry
  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'created_at'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    const updatedEntries = [newEntry, ...data];
    
    try {
      localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
      setData(updatedEntries);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('moodEntriesUpdate'));
      return true;
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      return false;
    }
  };

  // Function to get suggested music based on the latest mood
  const getSuggestedMusic = () => {
    if (data.length === 0) return "lofi";
    
    const latestMood = data[0].mood;
    
    if (["Happy", "Excited", "Joyful"].includes(latestMood)) {
      return "happy";
    } else if (["Sad", "Depressed", "Down"].includes(latestMood)) {
      return "calm";
    } else if (["Focused", "Productive", "Determined"].includes(latestMood)) {
      return "focus";
    }
    
    return "lofi";
  };

  return { 
    data, 
    isLoading, 
    error, 
    addMoodEntry,
    getSuggestedMusic
  };
}
