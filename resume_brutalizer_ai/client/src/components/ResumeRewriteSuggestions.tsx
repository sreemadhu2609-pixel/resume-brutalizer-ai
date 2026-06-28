import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, CheckCircle2 } from "lucide-react";

interface RewriteSuggestion {
  section: string;
  before: string;
  after: string;
  reasoning: string;
}

interface ResumeRewriteSuggestionsProps {
  suggestions: RewriteSuggestion[];
}

export function ResumeRewriteSuggestions({ suggestions }: ResumeRewriteSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      Skills: "bg-purple-500/10 text-purple-700",
      Experience: "bg-blue-500/10 text-blue-700",
      Projects: "bg-green-500/10 text-green-700",
      Summary: "bg-orange-500/10 text-orange-700",
      Education: "bg-pink-500/10 text-pink-700",
    };
    return colors[section] || "bg-gray-500/10 text-gray-700";
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-green-600" />
          Resume Rewrite Suggestions
        </CardTitle>
        <CardDescription>
          Specific improvements to make your resume more competitive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border border-green-100 rounded-lg p-4 bg-white/50 hover:bg-white transition">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getSectionColor(suggestion.section)}>
                  {suggestion.section}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Before</p>
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-gray-700">
                    <code className="text-red-700">{suggestion.before}</code>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-gray-400">↓</div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">After</p>
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <code className="text-green-700">{suggestion.after}</code>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Why:</strong> {suggestion.reasoning}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            <strong>✨ Action Item:</strong> Copy these suggestions into your resume. These changes will make you stand out to AI hiring managers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
