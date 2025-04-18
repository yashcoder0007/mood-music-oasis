
import { useState, useEffect } from "react";
import { Heart, Sparkles, Send, Quote, Music, Share, ThumbsUp, ArrowRight, Calendar, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MusicPlayer from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const [feeling, setFeeling] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  // Mock AI processing
  const processFeeling = (input: string) => {
    setIsProcessing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const responses = [
        "I understand you're feeling that way. Remember to take care of yourself today.",
        "It sounds like you're experiencing some complex emotions. That's completely normal.",
        "Thank you for sharing how you feel. Would you like to explore some self-care activities?",
        "I appreciate your honesty about your feelings. What might help you feel better right now?",
        "Your emotions are valid. Let's think about some ways to support your well-being today."
      ];
      
      setResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmitFeeling = () => {
    if (!feeling.trim()) return;
    
    setHasSubmitted(true);
    processFeeling(feeling);
    
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
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

  const toggleHeartSparkles = () => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD] dark:bg-gray-900">
      {/* Header Navigation */}
      <header className="bg-white dark:bg-gray-800 py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">MoodCraft</h1>
        <nav className="flex items-center space-x-8">
          <ThemeToggle />
          <a href="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </a>
          <a onClick={() => navigate("/dashboard")} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
            <LineChart className="h-5 w-5 mr-1" />
            Dashboard
          </a>
          <a onClick={() => navigate("/history")} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
            <Calendar className="h-5 w-5 mr-1" />
            Mood History
          </a>
          <button 
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
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
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">MoodCraft Emotional Companion</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI-powered companion for emotional support, mood enhancement, and mental wellness. 
            Share how you're feeling, and MoodCraft will respond with care.
          </p>
        </motion.section>

        {/* Echo Circle */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={toggleHeartSparkles}
        >
          <div className="relative">
            <motion.div 
              className="w-40 h-40 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {showSparkles ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </motion.div>
              ) : (
                <Heart className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              )}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-lg font-medium text-purple-800 dark:text-purple-300">Echo</p>
            </div>
            <div className="absolute -top-2 right-0">
              <Quote className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="absolute -bottom-2 left-0">
              <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col">
            <Textarea
              placeholder="How are you feeling today? Tell me about your emotions..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="border-0 focus-visible:ring-0 min-h-[120px] text-gray-800 dark:text-gray-200"
            />
            <div className="flex justify-end mt-3">
              <Button 
                onClick={handleSubmitFeeling} 
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 flex items-center gap-2"
              >
                <span>Share with Echo</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Response Section - Show after feeling is submitted */}
        {hasSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-xl mx-auto mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="flex space-x-2 mb-4">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["rgb(233 213 255)", "rgb(192 132 252)", "rgb(233 213 255)"]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-purple-200"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["rgb(233 213 255)", "rgb(192 132 252)", "rgb(233 213 255)"]
                      }}
                      transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-purple-200"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["rgb(233 213 255)", "rgb(192 132 252)", "rgb(233 213 255)"]
                      }}
                      transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-purple-200"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Echo is thinking...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-6">
                    <p className="text-gray-800 dark:text-gray-200">{response}</p>
                  </div>
                  
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Suggested Actions</h3>
                  <ul className="space-y-3 mb-6">
                    {suggestedActions.map((action, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <span className="flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 p-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">{action}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Echo Response</p>
                    <Button variant="link" className="text-purple-600 dark:text-purple-400 flex items-center p-0">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}

        {/* Two Column Layout for Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Inspiration Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-purple-50 dark:bg-gray-800 p-6 rounded-xl overflow-hidden relative">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2389&q=80')" }}
              ></div>
              
              <div className="relative z-10">
                <div className="flex items-start mb-4">
                  <Quote className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h3 className="font-medium text-purple-800 dark:text-purple-300">Daily Inspiration</h3>
                </div>
                <blockquote className="italic mb-2 text-gray-800 dark:text-gray-200">"{inspirationQuote.text}"</blockquote>
                <p className="text-right text-gray-600 dark:text-gray-400">— {inspirationQuote.author}</p>
                
                <div className="flex justify-start mt-6 space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 ${liked ? 'text-purple-600 dark:text-purple-400' : ''}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Music Recommendations Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-white dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <Music className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-medium text-purple-800 dark:text-purple-300">Music for your mood</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {musicMoods.map((mood) => (
                  <motion.div
                    key={mood.slug}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      variant="outline"
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-gray-700 dark:text-gray-300 justify-start w-full"
                      onClick={() => navigate(`/play/${mood.slug}`)}
                    >
                      {mood.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                variant="link" 
                className="text-purple-600 dark:text-purple-400 flex items-center p-0"
                onClick={() => navigate("/playlists")}
              >
                Explore playlists
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Action Buttons */}
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button 
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600" 
            onClick={() => navigate("/history")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Mood History
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            onClick={() => navigate("/dashboard")}
          >
            <LineChart className="h-5 w-5 mr-2" />
            Mood Dashboard
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        MoodCraft - Your personal AI wellness guide
      </footer>

      {/* Background Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
