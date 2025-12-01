import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageCircle, Book, Mail, Phone } from "lucide-react";

const Support = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Support & Help</h1>
        <p className="text-muted-foreground">Get assistance with Alert X</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 border-border/50 text-center glow-hover cursor-pointer">
          <Book className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground">Browse our guides and tutorials</p>
        </Card>

        <Card className="glass-card p-6 border-border/50 text-center glow-hover cursor-pointer">
          <MessageCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground">Chat with our support team</p>
        </Card>

        <Card className="glass-card p-6 border-border/50 text-center glow-hover cursor-pointer">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">FAQ</h3>
          <p className="text-sm text-muted-foreground">Find answers to common questions</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <form className="space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                className="glass-card border-border/50"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                className="glass-card border-border/50"
              />
            </div>
            <div>
              <Textarea
                placeholder="How can we help you?"
                className="glass-card border-border/50 min-h-[120px] resize-none"
              />
            </div>
            <Button className="w-full bg-gradient-glow hover:shadow-glow text-background font-semibold">
              Send Message
            </Button>
          </form>
        </Card>

        <Card className="glass-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Other Ways to Reach Us</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg glass-button border border-border/30">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Email Support</p>
                <p className="text-xs text-muted-foreground">Contact us via email</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg glass-button border border-border/30">
              <Phone className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Phone Support</p>
                <p className="text-xs text-muted-foreground">Call our support line</p>
              </div>
            </div>

            <div className="p-4 rounded-lg glass-button border border-primary/30 bg-primary/5">
              <h4 className="font-medium mb-2">Support Hours</h4>
              <p className="text-sm text-muted-foreground">
                Available 24/7 for emergency support<br />
                General inquiries: Business hours
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Support;