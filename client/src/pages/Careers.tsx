import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CareerModal from "@/components/CareerModal";
import { 
  Compass, 
  ArrowLeft, 
  Rocket,
  UserCheck,
  TrendingUp,
  DollarSign,
  Palette,
  Code,
  PaintbrushVertical,
  BarChart3,
  Megaphone
} from "lucide-react";

interface Career {
  id: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  growthRate: number;
  educationLevel: string;
  remoteWork: boolean;
  skills: string[];
  interests: string[];
  iconClass: string;
  colorScheme: string;
}

interface CareerRecommendation {
  id: string;
  careerId: string;
  matchScore: number;
  career: Career;
}

const getCareerIcon = (iconClass: string) => {
  switch (iconClass) {
    case "fas fa-palette":
      return <Palette className="w-6 h-6" />;
    case "fas fa-code":
      return <Code className="w-6 h-6" />;
    case "fas fa-paint-brush":
      return <PaintbrushVertical className="w-6 h-6" />;
    case "fas fa-chart-bar":
      return <BarChart3 className="w-6 h-6" />;
    case "fas fa-bullhorn":
      return <Megaphone className="w-6 h-6" />;
    default:
      return <Rocket className="w-6 h-6" />;
  }
};

const getColorScheme = (scheme: string) => {
  switch (scheme) {
    case "gradient-bg":
      return "gradient-bg";
    case "gradient-card":
      return "gradient-card";
    case "bg-accent":
      return "bg-accent";
    case "bg-secondary":
      return "bg-secondary";
    case "bg-primary":
      return "bg-primary";
    default:
      return "bg-primary";
  }
};

export default function Careers() {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: recommendations, isLoading, error } = useQuery<CareerRecommendation[]>({
    queryKey: ["/api/career-recommendations"],
    retry: false,
  });

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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-primary mr-2" />
              <h2 className="text-3xl font-bold">Your Career Matches</h2>
            </div>
            <p className="text-muted-foreground">Based on your personality and journal insights</p>
          </div>

          {!recommendations || recommendations.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Career Recommendations Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete your personality assessment and write some journal entries to get personalized career recommendations.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setLocation("/assessment")} data-testid="button-take-assessment">
                    Take Assessment
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/journal")} data-testid="button-write-journal">
                    Write Journal Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Top Matches */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recommendations.slice(0, 6).map((rec) => (
                  <Card 
                    key={rec.id} 
                    className="career-card cursor-pointer" 
                    onClick={() => setSelectedCareer(rec.career)}
                    data-testid={`career-card-${rec.career.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${getColorScheme(rec.career.colorScheme)} rounded-full flex items-center justify-center text-white`}>
                          {getCareerIcon(rec.career.iconClass)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(rec.matchScore * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{rec.career.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {rec.career.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.career.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className={`career-tag ${index % 3 === 0 ? 'creativity' : index % 3 === 1 ? 'problem-solving' : 'tech'}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="flex items-center mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${rec.career.salaryMin?.toLocaleString()} - ${rec.career.salaryMax?.toLocaleString()}
                        </p>
                        <p className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {Math.round((rec.career.growthRate || 0) * 100)}% growth expected
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Career Exploration Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personality Fit Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCheck className="text-primary mr-2 w-5 h-5" />
                      Personality Fit Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="skill-bar">
                        <span className="text-sm">Creativity</span>
                        <div className="flex items-center">
                          <div className="skill-progress">
                            <div className="skill-progress-fill bg-primary" style={{ width: '85%' }} />
                          </div>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="skill-bar">
                        <span className="text-sm">Problem Solving</span>
                        <div className="flex items-center">
                          <div className="skill-progress">
                            <div className="skill-progress-fill bg-secondary" style={{ width: '92%' }} />
                          </div>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                      <div className="skill-bar">
                        <span className="text-sm">Collaboration</span>
                        <div className="flex items-center">
                          <div className="skill-progress">
                            <div className="skill-progress-fill bg-accent" style={{ width: '75%' }} />
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                      <div className="skill-bar">
                        <span className="text-sm">Leadership</span>
                        <div className="flex items-center">
                          <div className="skill-progress">
                            <div className="skill-progress-fill bg-primary" style={{ width: '68%' }} />
                          </div>
                          <span className="text-sm font-medium">68%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interest Exploration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Compass className="text-primary mr-2 w-5 h-5" />
                      Interest Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="interest-area bg-primary/10 text-primary">
                        <Code className="text-primary text-xl mb-2 w-6 h-6 mx-auto" />
                        <p className="text-sm font-medium">Technology</p>
                      </div>
                      <div className="interest-area bg-accent/10 text-accent">
                        <Palette className="text-accent text-xl mb-2 w-6 h-6 mx-auto" />
                        <p className="text-sm font-medium">Design</p>
                      </div>
                      <div className="interest-area bg-secondary/10 text-secondary">
                        <UserCheck className="text-secondary text-xl mb-2 w-6 h-6 mx-auto" />
                        <p className="text-sm font-medium">People</p>
                      </div>
                      <div className="interest-area bg-muted text-muted-foreground">
                        <TrendingUp className="text-muted-foreground text-xl mb-2 w-6 h-6 mx-auto" />
                        <p className="text-sm font-medium text-muted-foreground">Environment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <CareerModal 
          career={selectedCareer} 
          onClose={() => setSelectedCareer(null)} 
        />
      )}
    </div>
  );
}
