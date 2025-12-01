import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Star, TrendingUp } from "lucide-react";

const CommunityFeed = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Community Feed</h1>
        <p className="text-muted-foreground">Real-time updates from verified users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-border/50 p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-sm text-muted-foreground">
                  Community posts will appear here when users submit reports
                </p>
                <div className="text-xs text-muted-foreground">
                  Connect to real-time feed for live updates
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card className="glass-card p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
            <div className="h-32 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-xs text-muted-foreground">
                  Top contributors will be displayed here
                </p>
              </div>
            </div>
          </Card>

          {/* Trending Tags */}
          <Card className="glass-card p-6 border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Topics
            </h3>
            <div className="h-32 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-xs text-muted-foreground">
                  Trending hashtags will appear here
                </p>
              </div>
            </div>
          </Card>

          {/* Saved Highlights */}
          <Card className="glass-card p-6 border-border/50 border-accent/30 bg-accent/5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Saved by You
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your saved posts will be displayed here
            </p>
            <Button variant="outline" className="w-full glass-card border-accent/50 hover:bg-accent/10">
              View Saved Posts
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;