import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MapView from "@/pages/MapView";
import Encyclopedia from "@/pages/Encyclopedia";
import Compare from "@/pages/Compare";
import TopNav from "@/components/layout/TopNav";
import { MapProvider } from "@/context/MapContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={MapView} />
      <Route path="/encyclopedia" component={Encyclopedia} />
      <Route path="/compare" component={Compare} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MapProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
              <TopNav />
              <div className="flex-1 overflow-hidden relative">
                <Router />
              </div>
            </div>
          </WouterRouter>
        </MapProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
