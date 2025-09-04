import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Compass, 
  Book, 
  ArrowLeft, 
  Brain, 
  Save,
  Calendar,
  Lightbulb
} from "lucide-react";

interface JournalEntry {
  id: string;
  mood: string;
  enjoyed: string;
  challenges: string;
  learned: string;
  createdAt: string;
  keywords?: string[];
  themes?: string[];
  skills?: string[];
}

const moodEmojis = [
  { emoji: "😊", value: "happy", label: "Happy" },
  { emoji: "😐", value: "neutral", label: "Neutral" },
  { emoji: "😔", value: "sad", label: "Sad" },
  { emoji: "😤", value: "frustrated", label: "Frustrated" },
  { emoji: "😴", value: "tired", label: "Tired" },
];

const writingPrompts = [
  "What made you feel proud today?",
  "Describe a moment when time flew by",
  "What would you change about your day?",
  "What new skill did you practice?",
  "Who inspired you today and why?",
  "What problem did you solve creatively?",
];

export default function Journal() {
  const [selectedMood, setSelectedMood] = useState("");
  const [enjoyed, setEnjoyed] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learned, setLearned] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: journalEntries, isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries"],
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (entryData: any) => {
      await apiRequest("POST", "/api/journal-entries", entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Entry Saved!",
        description: "Your journal entry has been saved and is being analyzed.",
      });
      // Clear form
      setSelectedMood("");
      setEnjoyed("");
      setChallenges("");
      setLearned("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood || !enjoyed.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select your mood and describe what you enjoyed today.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      mood: selectedMood,
      enjoyed: enjoyed.trim(),
      challenges: challenges.trim(),
      learned: learned.trim(),
    });
  };

  const handlePromptClick = (prompt: string) => {
    if (enjoyed) {
      setEnjoyed(enjoyed + "\n\n" + prompt);
    } else {
      setEnjoyed(prompt);
    }
  };

  const getAIInsights = () => {
    if (!journalEntries || journalEntries.length === 0) return [];
    
    const allThemes = journalEntries.flatMap(entry => entry.themes || []);
    const allSkills = journalEntries.flatMap(entry => entry.skills || []);
    
    const themeCount: { [key: string]: number } = {};
    const skillCount: { [key: string]: number } = {};
    
    allThemes.forEach(theme => {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
    
    allSkills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
    
    const topThemes = Object.entries(themeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);
    
    const topSkills = Object.entries(skillCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill);
    
    return [...topThemes, ...topSkills];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  const insights = getAIInsights();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Compass className="text-white text-sm w-4 h-4" />
            </div>
            <span className="font-bold text-lg">Niyati</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-primary mr-2" />
              <h2 className="text-3xl font-bold">Daily Journal</h2>
            </div>
            <p className="text-muted-foreground">Reflect on your experiences and let AI help you discover patterns</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Journal Entry Form */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today's Entry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label className="block text-sm font-medium mb-2">How are you feeling today?</Label>
                      <div className="flex space-x-2">
                        {moodEmojis.map((mood) => (
                          <button
                            key={mood.value}
                            type="button"
                            className={`mood-selector ${selectedMood === mood.value ? 'selected' : ''}`}
                            onClick={() => setSelectedMood(mood.value)}
                            data-testid={`mood-${mood.value}`}
                            title={mood.label}
                          >
                            {mood.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="enjoyed" className="block text-sm font-medium mb-2">
                        What did you enjoy most today? *
                      </Label>
                      <Textarea
                        id="enjoyed"
                        value={enjoyed}
                        onChange={(e) => setEnjoyed(e.target.value)}
                        placeholder="Describe what brought you joy or satisfaction today..."
                        className="min-h-[120px]"
                        data-testid="textarea-enjoyed"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="challenges" className="block text-sm font-medium mb-2">
                        What challenges did you face?
                      </Label>
                      <Textarea
                        id="challenges"
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Share any difficulties or obstacles you encountered..."
                        className="min-h-[120px]"
                        data-testid="textarea-challenges"
                      />
                    </div>

                    <div>
                      <Label htmlFor="learned" className="block text-sm font-medium mb-2">
                        What did you learn or discover?
                      </Label>
                      <Textarea
                        id="learned"
                        value={learned}
                        onChange={(e) => setLearned(e.target.value)}
                        placeholder="Reflect on new insights, skills, or knowledge gained..."
                        className="min-h-[120px]"
                        data-testid="textarea-learned"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={mutation.isPending}
                      data-testid="button-save-entry"
                    >
                      {mutation.isPending ? (
                        <>
                          <div className="loading-spinner w-4 h-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Entry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Insights */}
              {insights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Brain className="text-primary mr-2 w-5 h-5" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <div key={index} className="insight-tag">
                          <p className="text-sm font-medium capitalize">
                            {insight.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pattern detected in your entries
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {journalEntries && journalEntries.length > 0 ? (
                      journalEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </p>
                            {entry.mood && (
                              <span className="text-lg">
                                {moodEmojis.find(m => m.value === entry.mood)?.emoji}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.enjoyed.substring(0, 80)}...
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No entries yet. Start writing to see your history!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Writing Prompts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Lightbulb className="text-accent mr-2 w-5 h-5" />
                    Writing Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {writingPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="writing-prompt"
                        data-testid={`prompt-${index}`}
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
