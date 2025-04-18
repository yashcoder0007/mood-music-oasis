import { useState, useEffect } from "react";
import { Heart, Sparkles, Send, Quote, Music, Share, ThumbsUp, ArrowRight, Calendar, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MusicPlayer from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useMoodEntries } from "@/hooks/useMoodEntries";

interface MoodAnalysis {
  mood: string;
  intensity: number;
  suggestedActions: string[];
  musicRecommendations: string[];
  summary: string;
}

const Index = () => {
  const [feeling, setFeeling] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { data: moodEntries } = useMoodEntries();

  const analyzeMood = (text: string): MoodAnalysis => {
    const happyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good'];
    const sadWords = ['sad', 'unhappy', 'depressed', 'down', 'blue', 'miserable', 'upset'];
    const angryWords = ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated'];
    const anxiousWords = ['anxious', 'worried', 'nervous', 'afraid', 'scared', 'stressed'];
    const calmWords = ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene', 'content'];

    const lowercaseText = text.toLowerCase();
    const words = text.split(/\s+/).length;
    
    let happyCount = happyWords.filter(word => lowercaseText.includes(word)).length;
    let sadCount = sadWords.filter(word => lowercaseText.includes(word)).length;
    let angryCount = angryWords.filter(word => lowercaseText.includes(word)).length;
    let anxiousCount = anxiousWords.filter(word => lowercaseText.includes(word)).length;
    let calmCount = calmWords.filter(word => lowercaseText.includes(word)).length;

    if (happyCount + sadCount + angryCount + anxiousCount + calmCount === 0) {
      const exclamationCount = (text.match(/!/g) || []).length;
      if (exclamationCount > 1) happyCount += 1;
      
      const questionCount = (text.match(/\?/g) || []).length;
      if (questionCount > 1) anxiousCount += 1;
      
      if (words > 50) anxiousCount += 1;
      if (words < 5) sadCount += 1;
    }

    const moodScores = {
      "Happy": happyCount,
      "Sad": sadCount,
      "Angry": angryCount,
      "Anxious": anxiousCount,
      "Calm": calmCount
    };
    
    let dominantMood = "Neutral";
    let highestScore = 0;
    
    for (const [mood, score] of Object.entries(moodScores)) {
      if (score > highestScore) {
        highestScore = score;
        dominantMood = mood;
      }
    }
    
    if (highestScore === 0) dominantMood = "Neutral";
    
    const intensity = Math.min(10, Math.round((highestScore + 1) * 1.5 + (text.length / 100)));
    
    let suggestedActions: string[] = [];
    let musicRecommendations: string[] = [];
    let summary = "";
    
    switch(dominantMood) {
      case "Happy":
        suggestedActions = [
          "Share your joy with someone you care about",
          "Engage in creative activities that inspire you",
          "Express gratitude through journaling"
        ];
        musicRecommendations = ["Upbeat Acoustic", "Happy Vibes", "Cheerful Tune"];
        summary = "You're feeling positive and upbeat. This is a great time for creative projects or social activities.";
        break;
      case "Sad":
        suggestedActions = [
          "Practice self-compassion and gentle self-care",
          "Reach out to a supportive friend or family member",
          "Engage in light physical activity like walking"
        ];
        musicRecommendations = ["Gentle Ocean", "Peaceful Piano", "Morning Mist"];
        summary = "You may be experiencing some sadness. Remember to be kind to yourself during this time.";
        break;
      case "Angry":
        suggestedActions = [
          "Take deep breaths and practice grounding exercises",
          "Write down your thoughts to process them",
          "Engage in physical activity to release tension"
        ];
        musicRecommendations = ["Lofi Beat", "Chill Vibes", "Lofi Rain"];
        summary = "You seem to be experiencing some frustration. Finding healthy outlets for these emotions can be helpful.";
        break;
      case "Anxious":
        suggestedActions = [
          "Practice mindful breathing for 5 minutes",
          "Break tasks into smaller, manageable steps",
          "Limit caffeine and focus on staying hydrated"
        ];
        musicRecommendations = ["Gentle Ocean", "Peaceful Piano", "Morning Mist"];
        summary = "You may be feeling some anxiety. Grounding techniques and self-care can help manage these feelings.";
        break;
      case "Calm":
        suggestedActions = [
          "Continue your mindfulness practice",
          "Engage in activities that maintain this peaceful state",
          "Consider journaling about what brings you tranquility"
        ];
        musicRecommendations = ["Lofi Beat", "Chill Vibes", "Lofi Rain"];
        summary = "You're in a calm and balanced state. This is an excellent time for reflection or creative thinking.";
        break;
      default:
        suggestedActions = [
          "Take some time for self-reflection",
          "Practice mindfulness to connect with your emotions",
          "Consider journaling to explore your feelings"
        ];
        musicRecommendations = ["Study Beats", "Deep Focus", "Concentration"];
        summary = "Your emotional state appears balanced. This is a good time for productive activities.";
        break;
    }
    
    return {
      mood: dominantMood,
      intensity,
      suggestedActions,
      musicRecommendations,
      summary
    };
  };

  const processFeeling = (input: string) => {
    setIsProcessing(true);
    
    const analysis = analyzeMood(input);
    
    setMoodAnalysis(analysis);
    
    setTimeout(() => {
      const responses = {
        "Happy": [
          "It's wonderful to hear you're feeling positive! Your happiness is contagious.",
          "I'm glad you're feeling good today. What's contributing to your happy mood?",
          "That positive energy comes through clearly. It's a great day to channel that into something you love."
        ],
        "Sad": [
          "I understand you're feeling down. Remember that all emotions are valid and temporary.",
          "I'm sorry to hear you're feeling sad. Would it help to talk more about what's on your mind?",
          "When we acknowledge our sadness, we begin the process of healing. Thank you for sharing."
        ],
        "Angry": [
          "I can sense your frustration. Sometimes naming our feelings helps us process them better.",
          "It sounds like you're dealing with some challenging emotions. Would you like to explore ways to channel that energy?",
          "Anger often masks other feelings. Once you feel ready, exploring what's beneath might be helpful."
        ],
        "Anxious": [
          "I notice some worry in your words. Let's take a moment to breathe together.",
          "Anxiety can be overwhelming. Remember that you have successfully navigated anxious feelings before.",
          "When anxiety visits, it helps to ground yourself in the present moment. What's one thing you can see right now?"
        ],
        "Calm": [
          "You seem centered and at peace. That's a wonderful state to nurture.",
          "Your tranquility comes through in your words. What practices help you maintain this calm?",
          "This sense of calm you're experiencing creates space for clarity and insight."
        ],
        "Neutral": [
          "Thank you for sharing. How would you like to feel for the rest of today?",
          "I appreciate you checking in. Would you like to explore your emotions a bit more deeply?",
          "Sometimes a neutral state offers us a clean slate to decide where we want to go next."
        ]
      };
      
      const moodResponses = responses[analysis.mood as keyof typeof responses] || responses["Neutral"];
      setResponse(moodResponses[Math.floor(Math.random() * moodResponses.length)]);
      setIsProcessing(false);
      
      const newEntry = {
        id: Date.now().toString(),
        mood: analysis.mood,
        intensity: analysis.intensity,
        notes: input,
        created_at: new Date().toISOString(),
        music_played: analysis.musicRecommendations,
        actions: analysis.suggestedActions
      };
      
      const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      localStorage.setItem('moodEntries', JSON.stringify([newEntry, ...existingEntries]));
      
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

  const suggestedActions = moodAnalysis?.suggestedActions || [
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
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <header className="bg-card dark:bg-card py-4 px-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary dark:text-primary">MoodCraft</h1>
        <nav className="flex items-center space-x-8">
          <ThemeToggle />
          <a href="/" className="flex items-center text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </a>
          <a onClick={() => navigate("/dashboard")} className="flex items-center text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary cursor-pointer">
            <LineChart className="h-5 w-5 mr-1" />
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary dark:text-primary mb-4">MoodCraft Emotional Companion</h1>
          <p className="text-foreground dark:text-foreground max-w-2xl mx-auto">
            Your AI-powered companion for emotional support, mood enhancement, and mental wellness. 
            Share how you're feeling, and MoodCraft will respond with care.
          </p>
        </motion.section>

        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={toggleHeartSparkles}
        >
          <div className="relative">
            <motion.div 
              className="w-40 h-40 rounded-full bg-accent dark:bg-accent flex items-center justify-center"
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
                  <Sparkles className="h-12 w-12 text-primary dark:text-primary" />
                </motion.div>
              ) : (
                <Heart className="h-12 w-12 text-primary dark:text-primary" />
              )}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-lg font-medium text-primary-foreground dark:text-primary-foreground">Echo</p>
            </div>
            <div className="absolute -top-2 right-0">
              <Quote className="h-6 w-6 text-primary dark:text-primary" />
            </div>
            <div className="absolute -bottom-2 left-0">
              <Music className="h-6 w-6 text-primary dark:text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-card dark:bg-card rounded-xl shadow-sm p-4 flex flex-col">
            <Textarea
              placeholder="How are you feeling today? Tell me about your emotions..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="border-0 focus-visible:ring-0 min-h-[120px] text-foreground dark:text-foreground bg-card dark:bg-card"
            />
            <div className="flex justify-end mt-3">
              <Button 
                onClick={handleSubmitFeeling} 
                className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <span>Share with Echo</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {hasSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-xl mx-auto mb-8 bg-card dark:bg-card p-6 rounded-xl">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="flex space-x-2 mb-4">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))"]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-accent"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))"]
                      }}
                      transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-accent"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))"]
                      }}
                      transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-accent"
                    />
                  </div>
                  <p className="text-muted-foreground">Echo is thinking...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-accent/30 dark:bg-accent/30 rounded-lg mb-6">
                    <p className="text-foreground dark:text-foreground">{response}</p>
                  </div>
                  
                  {moodAnalysis && (
                    <div className="mb-4 p-3 bg-muted dark:bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Detected Mood: <span className="text-primary">{moodAnalysis.mood}</span></p>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">Intensity:</span>
                          <div className="h-2 w-24 bg-muted-foreground/20 rounded-full">
                            <div 
                              className="h-2 rounded-full bg-primary" 
                              style={{ width: `${moodAnalysis.intensity * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs ml-2">{moodAnalysis.intensity}/10</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="font-medium text-foreground dark:text-foreground mb-4">Suggested Actions</h3>
                  <ul className="space-y-3 mb-6">
                    {suggestedActions.map((action, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <span className="flex items-center justify-center rounded-full bg-accent/50 dark:bg-accent/50 p-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-foreground dark:text-foreground">{action}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">Echo Response</p>
                    <Button variant="link" className="text-primary dark:text-primary flex items-center p-0">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-accent/10 dark:bg-accent/10 p-6 rounded-xl overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2389&q=80')" }}
              ></div>
              
              <div className="relative z-10">
                <div className="flex items-start mb-4">
                  <Quote className="h-5 w-5 text-primary dark:text-primary mr-2" />
                  <h3 className="font-medium text-primary dark:text-primary">Daily Inspiration</h3>
                </div>
                <blockquote className="italic mb-2 text-foreground dark:text-foreground">"{inspirationQuote.text}"</blockquote>
                <p className="text-right text-muted-foreground dark:text-muted-foreground">— {inspirationQuote.author}</p>
                
                <div className="flex justify-start mt-6 space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary ${liked ? 'text-primary dark:text-primary' : ''}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-card dark:bg-card p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <Music className="h-5 w-5 text-primary dark:text-primary mr-2" />
                <h3 className="font-medium text-primary dark:text-primary">Music for your mood</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(moodAnalysis?.musicRecommendations || musicMoods.map(m => m.name)).map((mood, i) => (
                  <motion.div
                    key={mood}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      variant="outline"
                      className="bg-muted dark:bg-muted hover:bg-accent/50 dark:hover:bg-accent/50 text-foreground dark:text-foreground justify-start w-full"
                      onClick={() => navigate(`/play/${mood.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      {mood}
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                variant="link" 
                className="text-primary dark:text-primary flex items-center p-0"
                onClick={() => navigate("/playlists")}
              >
                Explore playlists
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button 
            className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90" 
            onClick={() => navigate("/history")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Mood History
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            onClick={() => navigate("/dashboard")}
          >
            <LineChart className="h-5 w-5 mr-2" />
            Mood Dashboard
          </Button>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-muted-foreground dark:text-muted-foreground border-t border-border">
        MoodCraft - Your personal AI wellness guide
      </footer>

      <MusicPlayer />
    </div>
  );
};

export default Index;
