
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
          setData(JSON.parse(storedEntries));
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
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    setData(updatedEntries);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('moodEntriesUpdate'));
  };

  return { data, isLoading, error, addMoodEntry };
}
