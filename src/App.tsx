
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NocProvider } from "./contexts/NocContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewNocRequest from "./pages/NewNocRequest";
import NocRequests from "./pages/NocRequests";
import PendingRequests from "./pages/PendingRequests";
import AllRequests from "./pages/AllRequests";
import DownloadNoc from "./pages/DownloadNoc";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NocProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-request" element={<NewNocRequest />} />
              <Route path="/noc-requests" element={<NocRequests />} />
              <Route path="/pending-requests" element={<PendingRequests />} />
              <Route path="/all-requests" element={<AllRequests />} />
              <Route path="/download-noc/:id" element={<DownloadNoc />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NocProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
