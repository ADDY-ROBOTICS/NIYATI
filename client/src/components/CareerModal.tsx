import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, TrendingUp, GraduationCap, Wifi } from "lucide-react";

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
  roadmapYear1?: string;
  roadmapYear2?: string;
  roadmapYear3?: string;
}

interface CareerModalProps {
  career: Career;
  onClose: () => void;
}

export default function CareerModal({ career, onClose }: CareerModalProps) {
  const formatRoadmapText = (text?: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim());
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="career-modal">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{career.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 rounded-full p-0"
            data-testid="button-close-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground">{career.description}</p>
              </div>

              {/* 3-Year Roadmap */}
              <div>
                <h3 className="text-lg font-semibold mb-3">3-Year Career Roadmap</h3>
                <div className="space-y-4">
                  {/* Year 1 */}
                  <div className="roadmap-year roadmap-year-1">
                    <div className="flex items-center mb-2">
                      <div className="roadmap-year-number">1</div>
                      <h4 className="font-semibold">Year 1: Foundation</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-11">
                      {formatRoadmapText(career.roadmapYear1).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Year 2 */}
                  <div className="roadmap-year roadmap-year-2">
                    <div className="flex items-center mb-2">
                      <div className="roadmap-year-number">2</div>
                      <h4 className="font-semibold">Year 2: Specialization</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-11">
                      {formatRoadmapText(career.roadmapYear2).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Year 3 */}
                  <div className="roadmap-year roadmap-year-3">
                    <div className="flex items-center mb-2">
                      <div className="roadmap-year-number">3</div>
                      <h4 className="font-semibold">Year 3: Professional Entry</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-11">
                      {formatRoadmapText(career.roadmapYear3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Quick Facts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Salary Range:
                      </span>
                      <span className="font-medium">
                        ${career.salaryMin?.toLocaleString()} - ${career.salaryMax?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Job Growth:
                      </span>
                      <span className="font-medium text-accent">
                        +{Math.round((career.growthRate || 0) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Education:
                      </span>
                      <span className="font-medium">{career.educationLevel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Wifi className="w-4 h-4 mr-1" />
                        Remote Work:
                      </span>
                      <span className={`font-medium ${career.remoteWork ? 'text-secondary' : 'text-muted-foreground'}`}>
                        {career.remoteWork ? 'High' : 'Limited'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Skills */}
              <div>
                <h4 className="font-semibold mb-3">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Similar Careers */}
              <div>
                <h4 className="font-semibold mb-3">Similar Careers</h4>
                <div className="space-y-2">
                  <div className="similar-career">
                    <p className="text-sm font-medium">UI Designer</p>
                    <p className="text-xs text-muted-foreground">89% match</p>
                  </div>
                  <div className="similar-career">
                    <p className="text-sm font-medium">Product Designer</p>
                    <p className="text-xs text-muted-foreground">86% match</p>
                  </div>
                  <div className="similar-career">
                    <p className="text-sm font-medium">Interaction Designer</p>
                    <p className="text-xs text-muted-foreground">82% match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
