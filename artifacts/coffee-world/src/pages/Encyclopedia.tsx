import { getVarieties, getProcesses } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FlavorRadar from "@/components/shared/FlavorRadar";

export default function Encyclopedia() {
  const varieties = getVarieties();
  const processes = getProcesses();

  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        <div className="max-w-2xl">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Coffee Encyclopedia</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive guide to the building blocks of specialty coffee. Explore the genetic lineages and processing methods that shape the flavors in your cup.
          </p>
        </div>

        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary block"></span>
              Varieties & Cultivars
            </h2>
            <p className="text-muted-foreground">The genetic foundation of coffee flavor.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {varieties.map(variety => (
              <Card key={variety.id} className="bg-card border-border/50 overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
                <CardHeader className="bg-background/50 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-serif text-primary">{variety.name}</CardTitle>
                    <Badge variant="outline" className="bg-background">{variety.origin}</Badge>
                  </div>
                  <CardDescription className="text-foreground/80 font-medium">
                    {variety.characteristics}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    {variety.description}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notable Regions</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {variety.notable_origins.map(o => <Badge key={o} variant="secondary" className="bg-background text-xs">{o}</Badge>)}
                    </div>
                  </div>
                  <div className="mt-auto border-t border-border pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Typical Flavor Profile</p>
                    <div className="h-48">
                      <FlavorRadar data={variety.flavor_profile} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary block"></span>
              Processing Methods
            </h2>
            <p className="text-muted-foreground">How cherries become green coffee beans.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map(process => (
              <Card key={process.id} className="bg-card border-border/50 flex flex-col hover:border-primary/30 transition-colors">
                <CardHeader className="bg-background/50">
                  <CardTitle className="text-xl font-serif text-primary">{process.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {process.description}
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Flavor Impact</p>
                    <p className="text-sm text-muted-foreground italic">
                      "{process.flavor_impact}"
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Process Steps</p>
                    <ol className="space-y-2">
                      {process.steps.map((step, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="pt-4 border-t border-border mt-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Common In</p>
                    <div className="flex flex-wrap gap-1.5">
                      {process.common_in.map(c => <Badge key={c} variant="outline" className="bg-background/50">{c}</Badge>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </ScrollArea>
  );
}
