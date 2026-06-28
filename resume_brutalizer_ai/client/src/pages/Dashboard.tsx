import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, FileText, CheckSquare, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const auditsQuery = trpc.resume.getAudits.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const tasksQuery = trpc.task.getTasks.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950 flex items-center justify-center">
        <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your dashboard and view your resume audits and tasks.
          </p>
          <Button size="lg" className="w-full" onClick={() => setLocation("/")}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name || "User"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Resume Audits</p>
                <p className="text-3xl font-bold text-foreground">
                  {auditsQuery.data?.length || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-foreground">
                  {tasksQuery.data?.filter((t: any) => t.status !== "completed").length || 0}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Resume Score</p>
                <p className="text-3xl font-bold text-primary">
                  {auditsQuery.data && auditsQuery.data.length > 0
                    ? Math.round(
                        auditsQuery.data.reduce((sum: number, a: any) => sum + a.overallScore, 0) /
                          auditsQuery.data.length
                      )
                    : "—"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Recent Audits */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Resume Audits</h2>
            <Button onClick={() => setLocation("/resume-brutalizer")}>
              New Audit
            </Button>
          </div>

          {auditsQuery.isLoading ? (
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading audits...</p>
            </Card>
          ) : auditsQuery.data && auditsQuery.data.length > 0 ? (
            <div className="space-y-4">
              {auditsQuery.data.slice(0, 5).map((audit: any) => (
                <Card
                  key={audit.id}
                  className="border-border/40 bg-slate-900/50 backdrop-blur p-4 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/resume-audit/${audit.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{audit.resumeFileName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(audit.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{audit.overallScore}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
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

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Tasks</h2>
            <Button onClick={() => setLocation("/task-architect")}>
              New Task
            </Button>
          </div>

          {tasksQuery.isLoading ? (
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </Card>
          ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
            <div className="space-y-4">
              {tasksQuery.data.slice(0, 5).map((task: any) => (
                <Card key={task.id} className="border-border/40 bg-slate-900/50 backdrop-blur p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {task.techStack.join(", ")} • {task.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{task.estimatedHours}h</p>
                      <p className="text-xs text-muted-foreground">{task.complexityLevel}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Button onClick={() => setLocation("/task-architect")}>
                Create Your First Task
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
