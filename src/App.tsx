import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Explorations from "./pages/Explorations";
import Projects from "./pages/Projects";
import Engagement from "./pages/Engagement";
import Skills from "./pages/Skills";
import CV from "./pages/CV";
import ProjectDetail from "./pages/ProjectDetail";
import TaskManagementDetail from "./pages/TaskManagementDetail";
import ExpenseTrackerDetail from "./pages/ExpenseTrackerDetail";
import TurtleArtDetail from "./pages/TurtleArtDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorations" element={<Explorations />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/task-management" element={<TaskManagementDetail />} />
            <Route path="/expense-tracker" element={<ExpenseTrackerDetail />} />
            <Route path="/turtle-art" element={<TurtleArtDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
