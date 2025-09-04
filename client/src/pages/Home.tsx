import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import ProgressRing from "@/components/ui/progress-ring";
import { 
  Compass, 
  Brain, 
  Book, 
  Rocket, 
  Trophy, 
  Flame, 
  Star, 
  Lock,
  PenTool,
  Users,
  Target,
  TrendingUp
} from "lucide-react";

interface DashboardStats {
  assessmentComplete: boolean;
  journalEntryCount: number;
  journalStreak: number;
  topRecommendations: Array<{
    career: {
      title: string;
      iconClass: string;
    };
    matchScore: number;
  }>;
  overallProgress: number;
}

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard"],
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

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
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="nav-btn text-primary font-medium cursor-pointer" data-testid="nav-dashboard">Dashboard</span>
            </Link>
            <Link href="/journal">
              <span className="nav-btn text-muted-foreground hover:text-primary cursor-pointer" data-testid="nav-journal">Journal</span>
            </Link>
            <Link href="/assessment">
              <span className="nav-btn text-muted-foreground hover:text-primary cursor-pointer" data-testid="nav-assessment">Assessment</span>
            </Link>
            <Link href="/careers">
              <span className="nav-btn text-muted-foreground hover:text-primary cursor-pointer" data-testid="nav-careers">Careers</span>
            </Link>
            <Button onClick={() => window.location.href = "/landing"} variant="outline" size="sm" data-testid="button-demo">
              Demo Mode
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {(user as any)?.firstName || 'Explorer'}! 👋
            </h1>
            <p className="text-muted-foreground">Track your progress and discover your purpose</p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall Progress */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <ProgressRing progress={stats?.overallProgress || 0} />
                </div>
                <h3 className="font-semibold mb-1">Journey Progress</h3>
                <p className="text-sm text-muted-foreground">Keep going!</p>
              </CardContent>
            </Card>

            {/* Assessment Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Brain className="text-white w-6 h-6" />
                  </div>
                  <span className={`font-semibold ${stats?.assessmentComplete ? 'text-accent' : 'text-muted-foreground'}`}>
                    {stats?.assessmentComplete ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Personality Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  {stats?.assessmentComplete ? 'Big Five analysis complete' : 'Complete your assessment'}
                </p>
              </CardContent>
            </Card>

            {/* Journal Entries */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Book className="text-white w-6 h-6" />
                  </div>
                  <span className="text-secondary font-semibold">
                    {stats?.journalEntryCount || 0} entries
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Journal Streak</h3>
                <p className="text-sm text-muted-foreground">
                  {stats?.journalStreak ? `${stats.journalStreak} day streak!` : 'Start your journey'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Daily Journal */}
            <Card className="gradient-card text-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Daily Journal</h3>
                    <p className="opacity-90">Reflect on your day and discover patterns</p>
                  </div>
                  <PenTool className="text-2xl opacity-75 w-6 h-6" />
                </div>
                <Link href="/journal">
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    data-testid="button-open-journal"
                  >
                    Write Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Career Recommendations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Career Matches</h3>
                    <p className="text-muted-foreground">Based on your personality and interests</p>
                  </div>
                  <Rocket className="text-2xl text-primary w-6 h-6" />
                </div>
                <Link href="/careers">
                  <Button data-testid="button-view-careers">
                    View Results
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Top Career Matches */}
          {stats?.topRecommendations && stats.topRecommendations.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Your Top Career Matches</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.topRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="text-white w-6 h-6" />
                      </div>
                      <p className="font-medium mb-1">{rec.career.title}</p>
                      <p className="text-sm text-primary font-semibold">
                        {Math.round(rec.matchScore * 100)}% match
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievement Badges */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="achievement-badge text-center p-4 bg-muted rounded-lg">
                  <div className="achievement-icon bg-accent">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">First Entry</p>
                </div>
                <div className={`achievement-badge text-center p-4 rounded-lg ${stats && stats.journalStreak >= 7 ? 'bg-muted' : 'bg-border opacity-50'}`}>
                  <div className={`achievement-icon ${stats && stats.journalStreak >= 7 ? 'bg-secondary' : 'bg-muted'}`}>
                    <Flame className={`w-6 h-6 ${stats && stats.journalStreak >= 7 ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <p className={`text-sm font-medium ${stats && stats.journalStreak >= 7 ? '' : 'text-muted-foreground'}`}>7-Day Streak</p>
                </div>
                <div className={`achievement-badge text-center p-4 rounded-lg ${stats?.assessmentComplete ? 'bg-muted' : 'bg-border opacity-50'}`}>
                  <div className={`achievement-icon ${stats?.assessmentComplete ? 'bg-primary' : 'bg-muted'}`}>
                    <Star className={`w-6 h-6 ${stats?.assessmentComplete ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <p className={`text-sm font-medium ${stats?.assessmentComplete ? '' : 'text-muted-foreground'}`}>Assessment Complete</p>
                </div>
                <div className="achievement-badge text-center p-4 bg-border rounded-lg opacity-50 locked">
                  <div className="achievement-icon bg-muted">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">30-Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
