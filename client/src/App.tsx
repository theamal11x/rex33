import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MinimalHomePage from "@/pages/minimal-home-page";
import AdminPage from "@/pages/admin-page";
import { AppProvider } from "./context/app-context";
import { SplashScreen } from "@/components/splash-screen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MinimalHomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <SplashScreen />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
