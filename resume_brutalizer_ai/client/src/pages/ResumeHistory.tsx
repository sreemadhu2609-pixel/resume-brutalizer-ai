import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

export default function ResumeHistory() {
  const [, setLocation] = useLocation();
  const auditsQuery = trpc.resume.getAudits.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Resume Audit History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {auditsQuery.isLoading ? (
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading audit history...</p>
          </Card>
        ) : auditsQuery.data && auditsQuery.data.length > 0 ? (
          <div className="space-y-4">
            {auditsQuery.data.map((audit) => (
              <Card key={audit.id} className="border-border/40 bg-slate-900/50 backdrop-blur p-6 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setLocation(`/resume-audit/${audit.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{audit.resumeFileName}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(audit.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {audit.improvementSuggestions.length} improvement suggestions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-3xl font-bold text-primary">{audit.overallScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
            <p className="text-muted-foreground mb-4">No resume audits yet</p>
            <Button onClick={() => setLocation("/resume-brutalizer")}>
              Create Your First Audit
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
