import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ResumeBrutalizer from "./pages/ResumeBrutalizer";
import TaskArchitect from "./pages/TaskArchitect";
import ResumeHistory from "./pages/ResumeHistory";
import ResumeAuditDetail from "./pages/ResumeAuditDetail";
import Dashboard from "./pages/Dashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resume-brutalizer" component={ResumeBrutalizer} />
      <Route path="/task-architect" component={TaskArchitect} />
      <Route path="/resume-history" component={ResumeHistory} />
      <Route path="/resume-audit/:id" component={ResumeAuditDetail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - Dark theme with high-contrast accent colors for AI/tech portfolio showcase
// - Color palette configured in index.css for consistent foreground/background
// - Theme is dark only (defaultTheme="dark")

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
