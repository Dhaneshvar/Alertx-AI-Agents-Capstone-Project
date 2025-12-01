import { Flame, CheckCircle2, Activity, Clock } from "lucide-react";
import MetricCard from "@/components/Dashboard/MetricCard";
import AIConsole from "@/components/Dashboard/AIConsole";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Command Dashboard</h1>
        <p className="text-muted-foreground">Real-time insights and AI-powered analytics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Incidents"
          value="--"
          icon={Flame}
          trend="Real-time data"
          iconColor="text-destructive"
        />
        <MetricCard
          title="AI Validated Reports"
          value="--"
          icon={CheckCircle2}
          trend="Accuracy tracking"
          iconColor="text-accent"
        />
        <MetricCard
          title="Safety Index"
          value="--"
          icon={Activity}
          trend="Weekly trends"
          iconColor="text-primary"
        />
        <MetricCard
          title="Avg Response Time"
          value="--"
          icon={Clock}
          trend="Performance metrics"
          iconColor="text-cyan-400"
        />
      </div>

      {/* Charts & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Graph */}
        <Card className="lg:col-span-2 glass-card p-6 border-border/50 animate-slide-up">
          <h3 className="text-lg font-semibold mb-6">Live Incident Trend</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-sm text-muted-foreground">
                Live incident trend chart will display here
              </p>
              <div className="text-xs text-muted-foreground">
                Connect to real-time data stream for live updates
              </div>
            </div>
          </div>
        </Card>

        {/* AI Confidence Monitor */}
        <Card className="glass-card p-6 border-border/50 animate-slide-up">
          <h3 className="text-lg font-semibold mb-6">AI Confidence Monitor</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-sm text-muted-foreground">
                AI confidence metrics will appear here
              </p>
              <div className="text-xs text-muted-foreground">
                Shows real-time AI model performance
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Console */}
      <AIConsole />

      {/* Recently Saved */}
      <Card className="glass-card p-6 border-border/50 animate-slide-up">
        <h3 className="text-lg font-semibold mb-6">Recently Saved by Users</h3>
        <div className="h-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-2">💾</div>
            <p className="text-sm text-muted-foreground">
              User-saved incidents will be displayed here
            </p>
            <div className="text-xs text-muted-foreground">
              Shows recent community bookmarks and saves
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;