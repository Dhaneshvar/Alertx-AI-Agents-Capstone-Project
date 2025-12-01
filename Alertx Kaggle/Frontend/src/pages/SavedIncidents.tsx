import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Brain, Trash2, Search } from "lucide-react";

const SavedIncidents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Saved Incidents</h1>
        <p className="text-muted-foreground">Quick access to your bookmarked incidents</p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-border/50"
          />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-48 glass-card border-border/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="severity">Severity</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Smart Layer Alert */}
      <Card className="glass-card p-4 border-accent/30 bg-accent/5">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground">
              Your saved incidents will appear here when you bookmark reports
            </p>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💾</div>
          <h3 className="text-lg font-semibold">No Saved Incidents</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            When you save incidents from the community feed or your reports, they'll appear here for quick access.
          </p>
          <div className="flex gap-2 justify-center mt-6">
            <Button variant="outline" className="glass-card border-primary/50 hover:border-primary gap-2">
              <Star className="h-4 w-4" />
              Browse Community
            </Button>
            <Button className="bg-gradient-glow hover:shadow-glow text-background gap-2">
              <MapPin className="h-4 w-4" />
              Report Incident
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedIncidents;