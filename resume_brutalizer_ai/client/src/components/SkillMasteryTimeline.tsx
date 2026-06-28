import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, AlertCircle } from "lucide-react";

interface MasteryItem {
  skill: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced";
  targetLevel: "Expert" | "Advanced";
  daysToMastery: number;
  prerequisites: string[];
}

interface SkillMasteryTimelineProps {
  timeline: MasteryItem[];
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-red-500/10 text-red-700";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-700";
    case "Advanced":
      return "bg-blue-500/10 text-blue-700";
    case "Expert":
      return "bg-green-500/10 text-green-700";
    default:
      return "bg-gray-500/10 text-gray-700";
  }
};

const getLevelProgress = (current: string, target: string) => {
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const currentIdx = levels.indexOf(current);
  const targetIdx = levels.indexOf(target);
  return ((currentIdx + 1) / (targetIdx + 1)) * 100;
};

export function SkillMasteryTimeline({ timeline }: SkillMasteryTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Skill Mastery Timeline
        </CardTitle>
        <CardDescription>
          Track your progression from current level to expert mastery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {timeline.map((item, index) => (
            <div key={index} className="border border-orange-100 rounded-lg p-4 bg-white/50 hover:bg-white transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.skill}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{item.daysToMastery} days to reach {item.targetLevel}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <div className="flex gap-2">
                      <Badge className={getLevelColor(item.currentLevel)} variant="outline">
                        {item.currentLevel}
                      </Badge>
                      <span className="text-xs text-gray-500">→</span>
                      <Badge className={getLevelColor(item.targetLevel)} variant="outline">
                        {item.targetLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${getLevelProgress(item.currentLevel, item.targetLevel)}%` }}
                    />
                  </div>
                </div>

                {/* Prerequisites */}
                {item.prerequisites && item.prerequisites.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Prerequisites:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.prerequisites.map((prereq, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-900">
            <strong>🎯 Milestone:</strong> Complete all prerequisites first, then focus on reaching your target level. You're on track to master these skills!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
