
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LineChart, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";

// Sample mood history data
const moodEntries = [
  { 
    id: 1, 
    date: "April 17, 2025", 
    mood: "Relaxed", 
    notes: "Had a peaceful day with minimal stress. Enjoyed some reading time.", 
    musicPlayed: ["Gentle piano", "Soothing ambient"],
    actions: ["Reading", "Meditation", "Walking"]
  },
  { 
    id: 2, 
    date: "April 16, 2025", 
    mood: "Energetic", 
    notes: "Productive day at work. Completed all tasks ahead of schedule.", 
    musicPlayed: ["Upbeat classics", "Motivational playlist"],
    actions: ["Exercise", "Deep work", "Socializing"]
  },
  { 
    id: 3, 
    date: "April 15, 2025", 
    mood: "Contemplative", 
    notes: "Feeling thoughtful today. Took time to journal and reflect on goals.", 
    musicPlayed: ["Acoustic ballads", "Classical symphonies"],
    actions: ["Journaling", "Planning", "Self-reflection"]
  },
  { 
    id: 4, 
    date: "April 14, 2025", 
    mood: "Tired", 
    notes: "Didn't sleep well last night. Focusing on rest and recovery today.", 
    musicPlayed: ["Gentle piano", "Sleep sounds"],
    actions: ["Rest", "Hydration", "Early bedtime"]
  },
  { 
    id: 5, 
    date: "April 13, 2025", 
    mood: "Happy", 
    notes: "Great day with friends. Feeling connected and grateful.", 
    musicPlayed: ["Feel-good playlist", "Upbeat classics"],
    actions: ["Socializing", "Gratitude practice", "Creative hobbies"]
  }
];

const History = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState("all");

  const filteredEntries = filter === "all" 
    ? moodEntries 
    : moodEntries.filter(entry => entry.mood.toLowerCase() === filter.toLowerCase());

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
          <a className="flex items-center text-purple-600">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600">Your Mood History</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className={view === "list" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              List View
            </Button>
            <Button 
              variant={view === "calendar" ? "default" : "outline"}
              onClick={() => setView("calendar")}
              className={view === "calendar" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              Calendar
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-purple-100">
            <TabsTrigger 
              value="all" 
              onClick={() => setFilter("all")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              All Moods
            </TabsTrigger>
            <TabsTrigger 
              value="happy" 
              onClick={() => setFilter("happy")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Happy
            </TabsTrigger>
            <TabsTrigger 
              value="relaxed" 
              onClick={() => setFilter("relaxed")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Relaxed
            </TabsTrigger>
            <TabsTrigger 
              value="energetic" 
              onClick={() => setFilter("energetic")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Energetic
            </TabsTrigger>
            <TabsTrigger 
              value="tired" 
              onClick={() => setFilter("tired")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Tired
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* History Display */}
        {view === "list" ? (
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-xl">
                <p className="text-gray-500">No mood entries found for this filter.</p>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <Card key={entry.id} className="p-6 bg-white rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                      <h3 className="text-xl font-semibold text-purple-800">{entry.mood}</h3>
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{entry.notes}</p>
                  
                  {entry.musicPlayed && entry.musicPlayed.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-600 mb-1">Music played:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.musicPlayed.map((music, index) => (
                          <span key={index} className="text-xs bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                            {music}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {entry.actions && entry.actions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Actions taken:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.actions.map((action, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl">
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 border border-gray-100 rounded-lg"></div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-24 border border-gray-200 rounded-lg p-1 hover:bg-purple-50 cursor-pointer transition-colors">
                  <div className="text-right text-sm text-gray-500">{i + 1}</div>
                  {i === 16 && (
                    <div className="mt-1 w-full">
                      <div className="bg-purple-200 text-purple-800 text-xs p-1 rounded truncate">
                        Relaxed
                      </div>
                    </div>
                  )}
                  {i === 15 && (
                    <div className="mt-1 w-full">
                      <div className="bg-green-200 text-green-800 text-xs p-1 rounded truncate">
                        Energetic
                      </div>
                    </div>
                  )}
                  {i === 14 && (
                    <div className="mt-1 w-full">
                      <div className="bg-blue-200 text-blue-800 text-xs p-1 rounded truncate">
                        Contemplative
                      </div>
                    </div>
                  )}
                  {i === 13 && (
                    <div className="mt-1 w-full">
                      <div className="bg-gray-200 text-gray-800 text-xs p-1 rounded truncate">
                        Tired
                      </div>
                    </div>
                  )}
                  {i === 12 && (
                    <div className="mt-1 w-full">
                      <div className="bg-yellow-200 text-yellow-800 text-xs p-1 rounded truncate">
                        Happy
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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

export default History;
