import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<Index />} />
          <Route path="/meetup" element={<Index />} />
          <Route path="/meetups" element={<Index />} />
          <Route path="/meetup/:id" element={<Index />} />
          <Route path="/meetups/:id" element={<Index />} />
          <Route path="/meetup-*" element={<Index />} />
          <Route path="/photos" element={<Index />} />
          <Route path="/gallery" element={<Index />} />
          <Route path="/activities" element={<Index />} />
          <Route path="/projects" element={<Index />} />
          <Route path="/community" element={<Index />} />
          <Route path="/join" element={<Index />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
