import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import SavedIncidents from "./pages/SavedIncidents";
import Analytics from "./pages/Analytics";
import CommunityFeed from "./pages/CommunityFeed";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background w-full">
          <Navbar />
          <Sidebar />
          <main className="ml-64 mt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<LiveMap />} />
              <Route path="/saved" element={<SavedIncidents />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/community" element={<CommunityFeed />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
