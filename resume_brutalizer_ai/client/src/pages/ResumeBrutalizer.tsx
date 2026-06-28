import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, CheckCircle2, FileUp, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function ResumeBrutalizer() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeResumeMutation = trpc.resume.analyzeResume.useMutation({
    onSuccess: (result) => {
      setAnalysisResult(result);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setAnalysisResult(null);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Content = (e.target?.result as string).split(",")[1];
      analyzeResumeMutation.mutate({
        fileName: selectedFile.name,
        fileContent: base64Content,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Resume Brutalizer</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!analysisResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
                  <p className="text-muted-foreground">
                    Get a brutal audit against 215 Indian AI Engineering JDs from 2026
                  </p>
                </div>

                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed border-border/40 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <FileUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-foreground font-semibold mb-2">
                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-muted-foreground">PDF files only</p>
                </div>

                {/* Analyze Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            </Card>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Skill Match Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      See how your skills align with top 20 in-demand AI skills
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Improvement Roadmap</h3>
                    <p className="text-sm text-muted-foreground">
                      Get specific, actionable suggestions to bridge your skill gaps
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
              <Button variant="outline" onClick={() => setLocation("/resume-history")}>
                View History
              </Button>
            </div>

            {/* Overall Score */}
            <Card className="border-border/40 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">{analysisResult.overallScore}</div>
                <p className="text-xl text-foreground">Overall Resume Score</p>
                <p className="text-muted-foreground">
                  {analysisResult.overallScore >= 70
                    ? "Strong alignment with 2026 AI market demands"
                    : analysisResult.overallScore >= 50
                      ? "Moderate alignment - focus on high-priority skills"
                      : "Significant gaps - prioritize RAG, LangChain, and FastAPI"}
                </p>
              </div>
            </Card>

            {/* Skill Match Breakdown */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Have vs. Have-Not Skill Breakdown</h3>
              <div className="space-y-4">
                {analysisResult.skillMatches.slice(0, 10).map((skill: any, idx: number) => (
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
                  {analysisResult.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  setAnalysisResult(null);
                  setSelectedFile(null);
                }}
              >
                Analyze Another Resume
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={() => setLocation("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
