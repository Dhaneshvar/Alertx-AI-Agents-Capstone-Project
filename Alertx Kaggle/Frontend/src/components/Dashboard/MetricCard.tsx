import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  iconColor?: string;
}

const MetricCard = ({ title, value, icon: Icon, trend, iconColor = "text-primary" }: MetricCardProps) => {
  return (
    <Card className="glass-card p-6 glow-hover border-border/50 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold gradient-text">{value}</h3>
          {trend && (
            <p className="text-xs text-accent font-medium">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg glass-button ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
