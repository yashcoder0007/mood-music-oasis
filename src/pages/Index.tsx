import { useState, useEffect } from "react";
import { Heart, Send, Quote, Music, Share, ThumbsUp, ArrowRight, Calendar, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import MusicPlayer from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [feeling, setFeeling] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitFeeling = () => {
    if (!feeling.trim()) return;
    
    setHasSubmitted(true);
    toast({
      title: "Response received",
      description: "Echo is analyzing your mood"
    });
  };

  const handleShare = () => {
    toast({
      title: "Quote shared",
      description: "Quote has been copied to clipboard"
    });
  };

  const inspirationQuote = {
    text: "Sadness is but a wall between two gardens.",
    author: "Kahlil Gibran"
  };

  const suggestedActions = [
    "Take some time for self-care",
    "Talk to someone you trust about your feelings",
    "Be gentle with yourself today"
  ];

  const musicMoods = [
    { name: "Gentle piano", slug: "gentle-piano" },
    { name: "Acoustic ballads", slug: "acoustic-ballads" },
    { name: "Melancholy symphonies", slug: "melancholy-symphonies" },
    { name: "Soothing ambient", slug: "soothing-ambient" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD] dark:bg-gray-900">
      {/* Header Navigation */}
      <header className="bg-white dark:bg-gray-800 py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">MoodCraft</h1>
        <nav className="flex items-center space-x-8">
          <ThemeToggle />
          <a href="/" className="flex items-center text-gray-700 hover:text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </a>
          <a onClick={() => navigate("/dashboard")} className="flex items-center text-gray-700 hover:text-purple-600 cursor-pointer">
            <LineChart className="h-5 w-5 mr-1" />
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
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">MoodCraft Emotional Companion</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your AI-powered companion for emotional support, mood enhancement, and mental wellness. 
            Share how you're feeling, and MoodCraft will respond with care.
          </p>
        </section>

        {/* Echo Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-purple-100 flex items-center justify-center">
              <Heart className="h-12 w-12 text-purple-600" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-lg font-medium text-purple-800">Echo</p>
            </div>
            <div className="absolute -top-2 right-0">
              <Quote className="h-6 w-6 text-purple-600" />
            </div>
            <div className="absolute -bottom-2 left-0">
              <Music className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm p-2 flex">
            <Input 
              placeholder="How are you feeling today?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
            <Button 
              onClick={handleSubmitFeeling} 
              size="icon" 
              className="bg-purple-600 hover:bg-purple-700 rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Response Section - Show after feeling is submitted */}
        {hasSubmitted && (
          <Card className="max-w-xl mx-auto mb-8 bg-white p-6 rounded-xl">
            <h3 className="font-medium text-gray-700 mb-4">Suggested Actions</h3>
            <ul className="space-y-3 mb-6">
              {suggestedActions.map((action, i) => (
                <li key={i} className="flex items-start">
                  <span className="flex items-center justify-center rounded-full bg-purple-100 p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {action}
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Echo Response</p>
              <Button variant="link" className="text-purple-600 flex items-center p-0">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* Two Column Layout for Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Inspiration Card */}
          <Card className="bg-purple-50 p-6 rounded-xl">
            <div className="flex items-start mb-4">
              <Quote className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-medium text-purple-800">Daily Inspiration</h3>
            </div>
            <blockquote className="italic mb-2">"{inspirationQuote.text}"</blockquote>
            <p className="text-right text-gray-600">— {inspirationQuote.author}</p>
            
            <div className="flex justify-start mt-6 space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-gray-600 hover:text-purple-600 ${liked ? 'text-purple-600' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-purple-600"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {/* Music Recommendations Card */}
          <Card className="bg-white p-6 rounded-xl">
            <div className="flex items-start mb-4">
              <Music className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-medium text-purple-800">Music for your mood</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {musicMoods.map((mood) => (
                <Button 
                  key={mood.slug} 
                  variant="outline"
                  className="bg-gray-100 hover:bg-purple-100 text-gray-700 justify-start"
                  onClick={() => navigate(`/play/${mood.slug}`)}
                >
                  {mood.name}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="link" 
              className="text-purple-600 flex items-center p-0"
              onClick={() => navigate("/playlists")}
            >
              Explore playlists
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            className="bg-purple-600 hover:bg-purple-700" 
            onClick={() => navigate("/history")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Mood History
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate("/dashboard")}
          >
            <LineChart className="h-5 w-5 mr-2" />
            Mood Dashboard
          </Button>
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

export default Index;
