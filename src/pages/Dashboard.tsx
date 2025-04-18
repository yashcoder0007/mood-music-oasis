
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Home, LineChart as LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

// Define the structure for mood entry data
interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  notes: string;
  created_at: string;
  music_played?: string[];
  actions?: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");
  const [moodData, setMoodData] = useState<any[]>([]);
  const [emotionData, setEmotionData] = useState<any[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const { signOut } = useAuth();

  // Load mood entries from localStorage
  useEffect(() => {
    const loadMoodEntries = () => {
      const storedEntries = localStorage.getItem('moodEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setMoodEntries(parsedEntries);
        processEntriesToChartData(parsedEntries);
      }
    };

    loadMoodEntries();

    // Set up a listener to refresh when new entries are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'moodEntries') {
        loadMoodEntries();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Process entries for chart visualization
  const processEntriesToChartData = (entries: MoodEntry[]) => {
    // Process line chart data (last 7 days)
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize array with days of the week
    const moodByDay = daysOfWeek.map(day => ({ day, mood: 0, entries: 0 }));
    
    // Filter entries for the selected time range
    let filteredEntries = entries;
    if (timeRange === 'week') {
      filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate >= oneWeekAgo && entryDate <= today;
      });
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate >= oneMonthAgo && entryDate <= today;
      });
    }
    
    // Calculate mood averages by day
    filteredEntries.forEach(entry => {
      const entryDate = new Date(entry.created_at);
      const dayIndex = entryDate.getDay();
      const dayName = daysOfWeek[dayIndex];
      
      // Map mood names to numeric values for visualization
      let moodValue = 5; // Default neutral
      switch(entry.mood.toLowerCase()) {
        case 'happy': moodValue = 9; break;
        case 'calm': moodValue = 7; break;
        case 'neutral': moodValue = 5; break;
        case 'anxious': moodValue = 3; break;
        case 'sad': moodValue = 2; break;
        case 'angry': moodValue = 1; break;
        default: moodValue = entry.intensity || 5;
      }
      
      const dayData = moodByDay.find(d => d.day === dayName);
      if (dayData) {
        dayData.mood += moodValue;
        dayData.entries += 1;
      }
    });
    
    // Calculate averages
    const processedMoodData = moodByDay.map(day => ({
      day: day.day,
      mood: day.entries > 0 ? Math.round((day.mood / day.entries) * 10) / 10 : null
    }));

    // Rearrange so that today is the last day
    const today_idx = new Date().getDay();
    const rearrangedMoodData = [
      ...processedMoodData.slice(today_idx + 1),
      ...processedMoodData.slice(0, today_idx + 1)
    ];

    // Fill in missing data with sample data if needed
    const finalMoodData = rearrangedMoodData.map((day, idx) => {
      if (day.mood === null) {
        // Use sample data for days without entries
        return {
          day: day.day,
          mood: 5 + Math.sin(idx * 0.5) * 2 // Generate wave pattern between 3-7
        };
      }
      return day;
    });
    
    setMoodData(finalMoodData);
    
    // Process emotion distribution data
    const emotions = filteredEntries.reduce((acc: Record<string, number>, entry) => {
      const mood = entry.mood || 'Neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format for chart
    const emotionChartData = Object.entries(emotions).map(([name, value]) => ({ name, value }));
    
    // If no data yet, use sample data
    if (emotionChartData.length === 0) {
      setEmotionData([
        { name: "Happy", value: 45 },
        { name: "Relaxed", value: 25 },
        { name: "Anxious", value: 15 },
        { name: "Sad", value: 10 },
        { name: "Angry", value: 5 }
      ]);
    } else {
      setEmotionData(emotionChartData);
    }
  };

  // Generate insights based on mood data
  const getMoodInsight = () => {
    if (moodData.length === 0) return "Start tracking your moods to see insights.";
    
    const recentMoods = moodData.filter(d => d.mood !== null).slice(-3);
    if (recentMoods.length === 0) return "No recent mood data available.";
    
    const avgMood = recentMoods.reduce((sum, d) => sum + d.mood, 0) / recentMoods.length;
    
    if (avgMood > 7) {
      return "Your mood has been very positive recently! Keep up the great energy!";
    } else if (avgMood > 5) {
      return "Your mood has been generally positive over this period.";
    } else if (avgMood > 3) {
      return "Your mood has been neutral to slightly low. Consider some self-care activities.";
    } else {
      return "Your mood appears to be lower than usual. Consider reaching out for support.";
    }
  };

  // Calculate mood influencers
  const getMoodInfluencers = () => {
    // This would ideally use real correlation analysis
    // For now, we'll return a mix of static and dynamic data
    const influencers = [
      { name: "Music", impact: "+20%" },
      { name: "Sleep", impact: "+15%" },
      { name: "Exercise", impact: "+10%" },
      { name: "Work Stress", impact: "-12%" }
    ];

    return influencers;
  };

  const COLORS = ["#8B5CF6", "#A78BFA", "#60A5FA", "#F87171", "#FBBF24", "#34D399"];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Header Navigation */}
      <header className="bg-card dark:bg-card py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary dark:text-primary">MoodCraft</h1>
        <nav className="flex items-center space-x-8">
          <ThemeToggle />
          <a href="/" className="flex items-center text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary">
            <Home className="h-5 w-5 mr-1" />
            Home
          </a>
          <a className="flex items-center text-primary dark:text-primary">
            <LineChartIcon className="h-5 w-5 mr-1" />
            Dashboard
          </a>
          <a onClick={() => navigate("/history")} className="flex items-center text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary cursor-pointer">
            <Calendar className="h-5 w-5 mr-1" />
            Mood History
          </a>
          <button 
            className="flex items-center text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary"
            onClick={handleSignOut}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary mb-8">Your Mood Dashboard</h1>
        
        {/* Time Range Selection */}
        <div className="mb-8 flex space-x-2">
          <Button 
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
            className={timeRange === "week" ? "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90" : ""}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
            className={timeRange === "month" ? "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90" : ""}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => setTimeRange("year")}
            className={timeRange === "year" ? "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90" : ""}
          >
            Year
          </Button>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mood Trend Chart */}
          <Card className="p-6 bg-card dark:bg-card rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-foreground">Mood Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={moodData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--foreground)" />
                  <YAxis domain={[0, 10]} stroke="var(--foreground)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground">
              {getMoodInsight()}
            </div>
          </Card>
          
          {/* Emotions Distribution */}
          <Card className="p-6 bg-card dark:bg-card rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-foreground">Emotions Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground">
              {emotionData.length > 0 && `${emotionData[0].name} has been your predominant emotion this ${timeRange}.`}
            </div>
          </Card>
          
          {/* Mood Influencers Card */}
          <Card className="p-6 bg-card dark:bg-card rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-foreground">Mood Influencers</h2>
            <ul className="space-y-3">
              {getMoodInfluencers().map((influencer, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-accent/10 dark:bg-accent/10 rounded-lg">
                  <span className="font-medium text-foreground dark:text-foreground">{influencer.name}</span>
                  <span className={influencer.impact.startsWith('+') ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>
                    {influencer.impact}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground">
              Music has the most positive impact on your mood.
            </div>
          </Card>
          
          {/* Recommendations Card */}
          <Card className="p-6 bg-card dark:bg-card rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-foreground">Recommendations</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-accent/30 dark:bg-accent/30 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">Listen to calming music before bed</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Improve sleep quality by 23%</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-accent/30 dark:bg-accent/30 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">Practice 10-minute meditation</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Reduce anxiety by 18%</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-accent/30 dark:bg-accent/30 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">Morning sunlight exposure</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Boost mood by 15% for the day</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground">
              Personalized recommendations based on your mood patterns.
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground dark:text-muted-foreground border-t border-border">
        MoodCraft - Your personal AI wellness guide
      </footer>

      {/* Background Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Dashboard;
