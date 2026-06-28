import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { SkillLearningRoadmap } from "@/components/SkillLearningRoadmap";
import { ResumeRewriteSuggestions } from "@/components/ResumeRewriteSuggestions";
import { SkillMasteryTimeline } from "@/components/SkillMasteryTimeline";

export default function ResumeAuditDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/resume-audit/:id");

  const auditId = params?.id ? parseInt(params.id) : null;
  const auditQuery = trpc.resume.getAuditById.useQuery(
    { id: auditId! },
    { enabled: !!auditId }
  );

  if (!match || !auditId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
            <p className="text-muted-foreground">Audit not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/resume-history")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Resume Audit Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {auditQuery.isLoading ? (
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading audit details...</p>
          </Card>
        ) : auditQuery.data ? (
          <div className="space-y-8">
            {/* Header Info */}
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {auditQuery.data.resumeFileName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Audited on {format(new Date(auditQuery.data.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Overall Score */}
            <Card className="border-border/40 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">{auditQuery.data.overallScore}</div>
                <p className="text-xl text-foreground">Overall Resume Score</p>
                <p className="text-muted-foreground">
                  {auditQuery.data.overallScore >= 70
                    ? "Strong alignment with 2026 AI market demands"
                    : auditQuery.data.overallScore >= 50
                      ? "Moderate alignment - focus on high-priority skills"
                      : "Significant gaps - prioritize RAG, LangChain, and FastAPI"}
                </p>
              </div>
            </Card>

            {/* Skill Match Breakdown */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Have vs. Have-Not Skill Breakdown</h3>
              <div className="space-y-4">
                {auditQuery.data.skillMatchData.map((skill: any, idx: number) => (
                  <Card key={idx} className="border-border/40 bg-slate-900/50 backdrop-blur p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {skill.matched ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="font-semibold text-foreground">{skill.skill}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">{skill.percentage}%</span>
                    </div>
                    <Progress value={skill.percentage} className="h-2" />
                  </Card>
                ))}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Improvement Suggestions</h3>
              <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
                <div className="space-y-4">
                  {auditQuery.data.improvementSuggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* NEW FEATURES */}
            {/* Skill Learning Roadmap */}
            {auditQuery.data.skillLearningRoadmap && auditQuery.data.skillLearningRoadmap.length > 0 && (
              <SkillLearningRoadmap roadmap={auditQuery.data.skillLearningRoadmap} />
            )}

            {/* Resume Rewrite Suggestions */}
            {auditQuery.data.resumeRewriteSuggestions && auditQuery.data.resumeRewriteSuggestions.length > 0 && (
              <ResumeRewriteSuggestions suggestions={auditQuery.data.resumeRewriteSuggestions} />
            )}

            {/* Skill Mastery Timeline */}
            {auditQuery.data.skillMasteryTimeline && auditQuery.data.skillMasteryTimeline.length > 0 && (
              <SkillMasteryTimeline timeline={auditQuery.data.skillMasteryTimeline} />
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => setLocation("/resume-brutalizer")}
              >
                Analyze Another Resume
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={() => setLocation("/resume-history")}>
                Back to History
              </Button>
            </div>
          </div>
        ) : (
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
            <p className="text-muted-foreground">Failed to load audit details</p>
          </Card>
        )}
      </div>
    </div>
  );
}
