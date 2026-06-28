import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { z } from "zod";

const TECH_STACK_OPTIONS = [
  "Java",
  "Python",
  "React",
  "Node.js",
  "FastAPI",
  "Docker",
  "AWS",
  "GCP",
  "GenAI",
  "LangChain",
  "RAG",
  "PostgreSQL",
  "MongoDB",
  "Kubernetes",
  "GraphQL",
];

export default function TaskArchitect() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStackTags: [] as string[],
  });
  const [isCreating, setIsCreating] = useState(false);

  const tasksQuery = trpc.task.getTasks.useQuery();
  const createTaskMutation = trpc.task.createTask.useMutation({
    onSuccess: () => {
      setFormData({ title: "", description: "", techStackTags: [] });
      tasksQuery.refetch();
    },
  });

  const deleteTaskMutation = trpc.task.deleteTask.useMutation({
    onSuccess: () => {
      tasksQuery.refetch();
    },
  });

  const handleAddTechStack = (tech: string) => {
    if (!formData.techStackTags.includes(tech)) {
      setFormData({
        ...formData,
        techStackTags: [...formData.techStackTags, tech],
      });
    }
  };

  const handleRemoveTechStack = (tech: string) => {
    setFormData({
      ...formData,
      techStackTags: formData.techStackTags.filter((t) => t !== tech),
    });
  };

  const handleCreateTask = async () => {
    if (!formData.title || formData.techStackTags.length === 0) {
      alert("Please fill in title and select at least one tech stack");
      return;
    }

    setIsCreating(true);
    createTaskMutation.mutate(formData);
    setIsCreating(false);
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "High":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
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
          <h1 className="text-2xl font-bold text-foreground">AI-Native Task Architect</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Create New Task</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Task Title</label>
                  <Input
                    placeholder="e.g., Build RAG chatbot"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-800/50 border-border/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe your task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-800/50 border-border/40 h-24"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Tech Stack</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <Button
                        key={tech}
                        variant={formData.techStackTags.includes(tech) ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() =>
                          formData.techStackTags.includes(tech)
                            ? handleRemoveTechStack(tech)
                            : handleAddTechStack(tech)
                        }
                      >
                        {formData.techStackTags.includes(tech) && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {tech}
                      </Button>
                    ))}
                  </div>
                </div>

                {formData.techStackTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.techStackTags.map((tech) => (
                      <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTechStack(tech)}>
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleCreateTask}
                  disabled={isCreating || !formData.title || formData.techStackTags.length === 0}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>

              {tasksQuery.isLoading ? (
                <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading tasks...</p>
                </Card>
              ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
                tasksQuery.data.map((task) => (
                  <Card key={task.id} className="border-border/40 bg-slate-900/50 backdrop-blur p-6">
                    <div className="space-y-4">
                      {/* Task Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTaskMutation.mutate({ id: task.id })}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2">
                        {task.techStackTags.map((tech: string) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* AI Predictions */}
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
                        {/* Complexity */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">COMPLEXITY</p>
                          <Badge className={`${getComplexityColor(task.complexityLevel || "Medium")}`}>
                            {task.complexityLevel || "Medium"}
                          </Badge>
                        </div>

                        {/* Estimated Hours */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">ESTIMATED HOURS</p>
                          <p className="text-lg font-bold text-primary">{task.predictedHours || 40}h</p>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">STATUS</p>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                      </div>

                      {/* Architecture Suggestion */}
                      {task.architectureSuggestion && (
                        <div className="pt-4 border-t border-border/40">
                          <p className="text-sm font-semibold text-foreground mb-2">Suggested Architecture</p>
                          <p className="text-sm text-muted-foreground">{task.architectureSuggestion}</p>
                        </div>
                      )}

                      {/* Recommended Frameworks */}
                      {task.recommendedFrameworks && task.recommendedFrameworks.length > 0 && (
                        <div className="pt-4 border-t border-border/40">
                          <p className="text-sm font-semibold text-foreground mb-2">Recommended Frameworks</p>
                          <div className="flex flex-wrap gap-2">
                            {task.recommendedFrameworks.map((fw: string) => (
                              <Badge key={fw} variant="outline" className="text-xs">
                                {fw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="border-border/40 bg-slate-900/50 backdrop-blur p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
