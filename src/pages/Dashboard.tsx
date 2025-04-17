
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Home, LineChart as LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@/components/MusicPlayer";

// Sample data for our charts
const moodData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 5 },
  { day: "Wed", mood: 4 },
  { day: "Thu", mood: 7 },
  { day: "Fri", mood: 6 },
  { day: "Sat", mood: 8 },
  { day: "Sun", mood: 9 },
];

const emotionData = [
  { name: "Happy", value: 45 },
  { name: "Relaxed", value: 25 },
  { name: "Anxious", value: 15 },
  { name: "Sad", value: 10 },
  { name: "Angry", value: 5 },
];

const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");

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
          <a className="flex items-center text-purple-600">
            <LineChartIcon className="h-5 w-5 mr-1" />
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-8">Your Mood Dashboard</h1>
        
        {/* Time Range Selection */}
        <div className="mb-8 flex space-x-2">
          <Button 
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
            className={timeRange === "week" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
            className={timeRange === "month" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => setTimeRange("year")}
            className={timeRange === "year" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Year
          </Button>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mood Trend Chart */}
          <Card className="p-6 bg-white rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Mood Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={moodData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "#8B5CF6" }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Your mood has been improving over the {timeRange}!
            </div>
          </Card>
          
          {/* Emotions Distribution */}
          <Card className="p-6 bg-white rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Emotions Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8B5CF6"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Majority of your emotions have been positive this {timeRange}.
            </div>
          </Card>
          
          {/* Mood Influencers Card */}
          <Card className="p-6 bg-white rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Mood Influencers</h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Music</span>
                <span className="text-green-600">+20%</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Sleep</span>
                <span className="text-green-600">+15%</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Exercise</span>
                <span className="text-green-600">+10%</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Work Stress</span>
                <span className="text-red-600">-12%</span>
              </li>
            </ul>
            <div className="mt-4 text-sm text-gray-500">
              Music has the most positive impact on your mood.
            </div>
          </Card>
          
          {/* Recommendations Card */}
          <Card className="p-6 bg-white rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-purple-100 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">Listen to calming music before bed</p>
                  <p className="text-sm text-gray-600">Improve sleep quality by 23%</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-purple-100 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">Practice 10-minute meditation</p>
                  <p className="text-sm text-gray-600">Reduce anxiety by 18%</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-purple-100 p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">Morning sunlight exposure</p>
                  <p className="text-sm text-gray-600">Boost mood by 15% for the day</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 text-sm text-gray-500">
              Personalized recommendations based on your mood patterns.
            </div>
          </Card>
        </div>
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

export default Dashboard;
