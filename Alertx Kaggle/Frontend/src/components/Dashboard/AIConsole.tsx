import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, AlertTriangle } from "lucide-react";

const AIConsole = () => {
  const updates = [
    {
      id: 1,
      message: "Flood alert in Sector 4, 89% AI confidence. Response deployed.",
      confidence: 89,
      type: "warning",
      time: "2 mins ago",
    },
    {
      id: 2,
      message: "Traffic incident validated on Main St. Low severity detected.",
      confidence: 94,
      type: "success",
      time: "5 mins ago",
    },
    {
      id: 3,
      message: "Power outage reported in District 2. Analyzing pattern...",
      confidence: 76,
      type: "info",
      time: "8 mins ago",
    },
  ];

  return (
    <Card className="glass-card p-6 border-border/50 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Brain className="h-5 w-5 text-primary animate-pulse-glow" />
        </div>
        <h3 className="text-lg font-semibold">AI Assistant Console</h3>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-4 rounded-lg glass-button border border-border/30 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              {update.type === "success" && (
                <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
              )}
              {update.type === "warning" && (
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              {update.type === "info" && (
                <Brain className="h-5 w-5 text-primary mt-0.5" />
              )}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-foreground/90">{update.message}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-muted rounded-full w-24 overflow-hidden">
                      <div
                        className="h-full bg-gradient-glow rounded-full transition-all"
                        style={{ width: `${update.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {update.confidence}% confident
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{update.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIConsole;
