import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Data-driven intelligence for smart city operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Frequency */}
        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Incident Frequency by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-sm text-muted-foreground">
                Chart will display incident data when available
              </p>
              <div className="text-xs text-muted-foreground">
                Connect to data source to view analytics
              </div>
            </div>
          </div>
        </Card>

        {/* Heatmap Placeholder */}
        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">City Risk Heatmap</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-sm text-muted-foreground">
                Interactive heatmap overlay showing incident density across city zones
              </p>
              <div className="text-xs text-muted-foreground mt-4">
                Map visualization will appear when connected to real-time data
              </div>
            </div>
          </div>
        </Card>

        {/* AI Reasoning Trace */}
        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">AI Reasoning Trace</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-sm text-muted-foreground">
                AI reasoning factors and weights will be displayed here
              </p>
              <div className="text-xs text-muted-foreground">
                Shows multi-factor analysis used for incident validation
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
          
          <div className="space-y-6">
            {/* Carbon Reduction */}
            <div className="p-4 rounded-lg glass-button border border-accent/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Carbon Emission Reduction</span>
                <span className="text-2xl">🌿</span>
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">--</div>
              <p className="text-xs text-muted-foreground">CO₂ saved through eco-routing</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                <div className="h-full bg-accent rounded-full" style={{ width: "0%" }} />
              </div>
            </div>

            {/* Confidence Score */}
            <div className="p-4 rounded-lg glass-button border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Average AI Confidence</span>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">--</div>
              <p className="text-xs text-muted-foreground">Across all incident validations</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-glow rounded-full" style={{ width: "0%" }} />
              </div>
            </div>

            {/* Response Time */}
            <div className="p-4 rounded-lg glass-button border border-cyan-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Response Time Improvement</span>
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">--</div>
              <p className="text-xs text-muted-foreground">Incident response vs baseline</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;