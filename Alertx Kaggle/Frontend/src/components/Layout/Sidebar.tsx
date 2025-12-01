import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  Star,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Live Map", icon: Map, path: "/map" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Saved Incidents", icon: Star, path: "/saved" },
  { title: "Community Feed", icon: Users, path: "/community" },
  { title: "Support", icon: HelpCircle, path: "/support" },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass-panel border-r border-border/50 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                "hover:bg-primary/10 hover:shadow-glow",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-border/50">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
