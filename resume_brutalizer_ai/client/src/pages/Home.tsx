import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, FileText, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AI Career Tools</span>
          </div>
          {!isAuthenticated ? (
            <a href={getLoginUrl()}>
              <Button>Sign In</Button>
            </a>
          ) : (
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Dashboard
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Master the <span className="text-primary">2026 AI Tech Stack</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get brutally honest feedback on your resume against 215 Indian AI Engineering JDs, and architect intelligent solutions with AI-powered predictions.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <>
                <Button size="lg" onClick={() => setLocation("/resume-brutalizer")}>
                  Resume Brutalizer <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setLocation("/task-architect")}>
                  Task Architect <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Brutalizer Card */}
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur hover:border-primary/50 transition-all p-8">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Resume Brutalizer</h2>
                <p className="text-sm text-muted-foreground mt-1">AI-powered resume audit</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Upload your resume and get a brutal audit against 2026 Indian AI job descriptions. See exactly where you stand with skill match percentages and actionable improvement suggestions.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Skill gap analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Overall score (0-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Specific improvement roadmap</span>
              </div>
            </div>
            {isAuthenticated ? (
              <Button className="w-full" onClick={() => setLocation("/resume-brutalizer")}>
                Start Resume Audit
              </Button>
            ) : (
              <a href={getLoginUrl()} className="w-full block">
                <Button className="w-full">Sign In to Start</Button>
              </a>
            )}
          </Card>

          {/* Task Architect Card */}
          <Card className="border-border/40 bg-slate-900/50 backdrop-blur hover:border-primary/50 transition-all p-8">
            <div className="flex items-start gap-4 mb-6">
              <Brain className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI-Native Task Architect</h2>
                <p className="text-sm text-muted-foreground mt-1">Intelligent task planning</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Define your development tasks and let AI predict complexity, suggest architecture patterns, and recommend the best frameworks for your tech stack.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Complexity prediction (hours/effort)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Architecture recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Framework suggestions</span>
              </div>
            </div>
            {isAuthenticated ? (
              <Button className="w-full" onClick={() => setLocation("/task-architect")}>
                Start Task Planning
              </Button>
            ) : (
              <a href={getLoginUrl()} className="w-full block">
                <Button className="w-full">Sign In to Start</Button>
              </a>
            )}
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border/40">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">215</div>
            <p className="text-muted-foreground">Indian AI JDs Analyzed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">87%</div>
            <p className="text-muted-foreground">RAG Skill Demand</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">2026</div>
            <p className="text-muted-foreground">Latest Market Data</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-slate-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for Indian tech professionals mastering AI in 2026</p>
        </div>
      </footer>
    </div>
  );
}
