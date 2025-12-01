import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, MapPin, Brain, Star, AlertTriangle, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportIncident = () => {
  const [severity, setSeverity] = useState([50]);
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Incident Reported",
      description: "Your report has been submitted and is being validated by AI.",
    });
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Report Incident</h1>
        <p className="text-muted-foreground">Submit a new incident with AI-powered validation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <Card className="lg:col-span-2 glass-card p-6 border-border/50 space-y-6">
          {/* Upload Zone */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Upload Evidence</Label>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-all cursor-pointer glass-button">
              <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop files or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Photos, videos, or documents (Max 10MB)
              </p>
            </div>
          </div>

          {/* Event Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Event Category</Label>
            <Select>
              <SelectTrigger className="glass-card border-border/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">🌊 Flood</SelectItem>
                <SelectItem value="fire">🔥 Fire</SelectItem>
                <SelectItem value="traffic">🚗 Traffic Incident</SelectItem>
                <SelectItem value="crime">🚨 Crime</SelectItem>
                <SelectItem value="power">⚡ Power Outage</SelectItem>
                <SelectItem value="other">📋 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Auto-detected via GPS"
                className="pl-10 glass-card border-border/50"
              />
            </div>
          </div>

          {/* Severity Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Severity Level</Label>
              <span className="text-sm font-medium text-accent">{severity[0]}%</span>
            </div>
            <Slider
              value={severity}
              onValueChange={setSeverity}
              max={100}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button size="sm" variant="ghost" className="gap-2 h-8">
                <Mic className="h-3 w-3" />
                Voice Input
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe what happened in detail..."
              className="glass-card border-border/50 min-h-[120px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 glass-button border-primary/30 hover:shadow-glow gap-2">
              <Brain className="h-4 w-4" />
              Validate with AI
            </Button>
            <Button variant="outline" className="flex-1 glass-card border-accent/50 text-accent hover:bg-accent/10 gap-2">
              <Star className="h-4 w-4" />
              Save for Later
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-glow hover:shadow-glow text-background font-semibold gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Submit Incident Report
          </Button>
        </Card>

        {/* Assistant Panel */}
        <div className="space-y-6">
          <Card className="glass-card p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Reporting Tips
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Include clear photos or videos if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Describe exact location and time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Mention any immediate dangers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>AI will validate your report automatically</span>
              </li>
            </ul>
          </Card>

          <Card className="glass-card p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
            <div className="h-32 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-xs text-muted-foreground">
                  AI suggestions will appear here based on your input
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 border-destructive/30 bg-destructive/5 border-border/50">
            <h3 className="text-lg font-semibold mb-2 text-destructive">Emergency Contact</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For life-threatening emergencies
            </p>
            <Button className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold">
              Call 911
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;