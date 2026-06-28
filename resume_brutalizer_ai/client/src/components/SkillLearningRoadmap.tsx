import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Zap } from "lucide-react";

interface RoadmapItem {
  skill: string;
  days: number;
  resources: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

interface SkillLearningRoadmapProps {
  roadmap: RoadmapItem[];
}

export function SkillLearningRoadmap({ roadmap }: SkillLearningRoadmapProps) {
  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          30-Day Learning Roadmap
        </CardTitle>
        <CardDescription>
          Master your skill gaps with this personalized learning path
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roadmap.map((item, index) => (
            <div key={index} className="border border-blue-100 rounded-lg p-4 bg-white/50 hover:bg-white transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.skill}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{item.days} days to learn</span>
                  </div>
                </div>
                <Badge className={`${getDifficultyColor(item.difficulty)} border`}>
                  {item.difficulty}
                </Badge>
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Recommended Resources:
                </p>
                <ul className="space-y-1">
                  {item.resources.map((resource, idx) => (
                    <li key={idx} className="text-sm text-gray-600 ml-6 list-disc">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Pro Tip:</strong> Dedicate 1-2 hours daily to each skill. Most developers complete this roadmap in 60-90 days with consistent effort.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
