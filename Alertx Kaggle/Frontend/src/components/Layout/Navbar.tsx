import { Bell, Search, Star, Settings, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-border/50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Alert X</h1>
            <p className="text-xs text-muted-foreground">Watson X Agent</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents, locations, or ask AI..."
              className="pl-10 pr-12 glass-card border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-primary/20"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="relative glow-hover hover:bg-primary/20"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="glow-hover hover:bg-accent/20"
          >
            <Star className="h-5 w-5 fill-accent text-accent" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="glow-hover hover:bg-primary/20"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Avatar className="h-9 w-9 border-2 border-primary/30 cursor-pointer hover:border-primary/60 transition-all">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
