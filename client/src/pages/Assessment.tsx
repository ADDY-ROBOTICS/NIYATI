import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Compass, Brain, ArrowLeft } from "lucide-react";

interface Question {
  id: number;
  text: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  reverse?: boolean;
}

const questions: Question[] = [
  { id: 1, text: "I prefer to work in groups rather than alone", trait: 'extraversion' },
  { id: 2, text: "I like to try new and unusual things", trait: 'openness' },
  { id: 3, text: "I am always prepared and organized", trait: 'conscientiousness' },
  { id: 4, text: "I am sympathetic to others' feelings", trait: 'agreeableness' },
  { id: 5, text: "I get easily stressed or anxious", trait: 'neuroticism' },
  { id: 6, text: "I enjoy being the center of attention", trait: 'extraversion' },
  { id: 7, text: "I appreciate art and beauty", trait: 'openness' },
  { id: 8, text: "I stick to my plans and finish what I start", trait: 'conscientiousness' },
  { id: 9, text: "I trust others easily", trait: 'agreeableness' },
  { id: 10, text: "I worry about things that might go wrong", trait: 'neuroticism' },
  { id: 11, text: "I feel comfortable around people", trait: 'extraversion' },
  { id: 12, text: "I enjoy abstract or theoretical discussions", trait: 'openness' },
  { id: 13, text: "I am reliable and can be counted on", trait: 'conscientiousness' },
  { id: 14, text: "I try to be courteous to everyone I meet", trait: 'agreeableness' },
  { id: 15, text: "I remain calm under pressure", trait: 'neuroticism', reverse: true },
  { id: 16, text: "I start conversations with strangers", trait: 'extraversion' },
  { id: 17, text: "I have a vivid imagination", trait: 'openness' },
  { id: 18, text: "I pay attention to details", trait: 'conscientiousness' },
  { id: 19, text: "I am interested in other people's problems", trait: 'agreeableness' },
  { id: 20, text: "I am easily disturbed by events", trait: 'neuroticism' },
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: existingAssessment, isLoading: loadingAssessment } = useQuery({
    queryKey: ["/api/personality-assessment"],
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      await apiRequest("POST", "/api/personality-assessment", assessmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Assessment Complete!",
        description: "Your personality profile has been saved. Generating career recommendations...",
      });
      setTimeout(() => {
        setLocation("/");
      }, 2000);
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
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (existingAssessment) {
      toast({
        title: "Assessment Already Complete",
        description: "You have already completed the personality assessment.",
      });
      setLocation("/");
    }
  }, [existingAssessment, setLocation, toast]);

  if (loadingAssessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  const handleAnswerSelect = (value: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    // Calculate Big Five scores
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    const counts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const score = question.reverse ? 6 - answer : answer;
        scores[question.trait] += score;
        counts[question.trait]++;
      }
    });

    // Normalize scores to 0-1 range
    Object.keys(scores).forEach(trait => {
      const key = trait as keyof typeof scores;
      scores[key] = counts[key] > 0 ? (scores[key] / counts[key]) / 5 : 0;
    });

    mutation.mutate(scores);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[questions[currentQuestion].id];

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
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-primary mr-2" />
              <h2 className="text-3xl font-bold">Personality Assessment</h2>
            </div>
            <p className="text-muted-foreground">Answer honestly to get the most accurate results</p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {questions[currentQuestion].text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { value: 1, label: "Strongly Disagree" },
                  { value: 2, label: "Disagree" },
                  { value: 3, label: "Neutral" },
                  { value: 4, label: "Agree" },
                  { value: 5, label: "Strongly Agree" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="custom-radio"
                    data-testid={`option-${option.value}`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option.value}
                      checked={currentAnswer === option.value}
                      onChange={() => handleAnswerSelect(option.value)}
                      className="sr-only"
                    />
                    <div className="radio-dot">
                      <div className="radio-dot-inner" />
                    </div>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  data-testid="button-previous"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer || mutation.isPending}
                  data-testid="button-next"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="loading-spinner w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : currentQuestion === questions.length - 1 ? (
                    "Complete Assessment"
                  ) : (
                    "Next Question"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
