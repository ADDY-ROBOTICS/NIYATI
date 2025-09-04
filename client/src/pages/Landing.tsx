import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/";
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center text-white">
        <div className="animate-float mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="text-white text-4xl w-12 h-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to Niyati</h1>
        <p className="text-lg opacity-90 mb-8">
          Discover your purpose and find the perfect career path that aligns with your passion, skills, and values.
        </p>
        <Button 
          onClick={handleGetStarted}
          data-testid="button-get-started"
          className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all transform hover:scale-105"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
