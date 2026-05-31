import { getVarieties, getProcesses } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FlavorRadar from "@/components/shared/FlavorRadar";

const MARKET_COLORS: Record<string, string> = {
  "Ultra-premium, auction market": "border-amber-400/50 bg-amber-400/10 text-amber-300",
  "Ultra-premium":                 "border-amber-400/50 bg-amber-400/10 text-amber-300",
  "High":                          "border-primary/40 bg-primary/10 text-primary",
  "Mainstream Specialty":          "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

export default function Encyclopedia() {
  const varieties = getVarieties();
  const processes = getProcesses();

  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        <div className="max-w-2xl">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Coffee Encyclopedia</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive guide to the building blocks of specialty coffee — the genetic lineages, cultivars, and processing methods that shape the flavors in your cup.
          </p>
        </div>

        {/* ── Varieties ─────────────────────────────────────── */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary block" />
              Varieties &amp; Cultivars
            </h2>
            <p className="text-muted-foreground">The genetic foundation of coffee flavor — from ancient landraces to modern breeding achievements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {varieties.map(variety => (
              <Card key={variety.id} className="bg-card border-border/50 overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
                <CardHeader className="bg-background/50 pb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <CardTitle className="text-xl font-serif text-primary leading-tight">{variety.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 whitespace-nowrap ${MARKET_COLORS[variety.specialty_market] ?? "border-border bg-background"}`}
                    >
                      {variety.specialty_market}
                    </Badge>
                  </div>

                  {variety.aliases.length > 0 && (
                    <p className="text-xs text-muted-foreground">aka {variety.aliases.join(", ")}</p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">{variety.origin_country}</span>
                    <span>·</span>
                    <span className="italic">{variety.botanical_group}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-5 flex-1 flex flex-col gap-5">
                  {/* Cup profile summary */}
                  <p className="text-sm font-medium text-foreground/80 italic leading-relaxed border-l-2 border-primary/40 pl-3">
                    "{variety.cup_profile_summary}"
                  </p>

                  {/* Known for */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{variety.known_for}</p>

                  {/* Flavor notes */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Flavor Notes</p>
                    <div className="flex flex-wrap gap-1">
                      {variety.flavor_notes.map(n => (
                        <Badge key={n} variant="secondary" className="text-[10px] bg-primary/10 text-primary/80 border border-primary/20 py-0">{n}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Best countries */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Best Countries</p>
                    <div className="flex flex-wrap gap-1.5">
                      {variety.best_countries.map(c => (
                        <Badge key={c} variant="outline" className="text-xs bg-background">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background/50 rounded-lg p-2 border border-border">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Altitude</p>
                      <p className="text-xs font-medium leading-tight">{variety.altitude_preference_m}m</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 border border-border">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Yield</p>
                      <p className="text-xs font-medium">{variety.yield_potential}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 border border-border">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Disease</p>
                      <p className="text-xs font-medium">{variety.disease_resistance}</p>
                    </div>
                  </div>

                  {/* Famous examples */}
                  {variety.famous_examples.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Famous Examples</p>
                      <ul className="space-y-0.5">
                        {variety.famous_examples.map(ex => (
                          <li key={ex} className="text-xs text-muted-foreground flex gap-1.5">
                            <span className="text-primary shrink-0">·</span>{ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Radar chart */}
                  <div className="mt-auto border-t border-border pt-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center mb-1">Flavor Archetype</p>
                    <div className="h-48">
                      <FlavorRadar data={variety.flavor_archetype} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Processing Methods ────────────────────────────── */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary block" />
              Processing Methods
            </h2>
            <p className="text-muted-foreground">How cherries become green coffee beans — and how each method shapes the cup.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map(process => (
              <Card key={process.id} className="bg-card border-border/50 flex flex-col hover:border-primary/30 transition-colors">
                <CardHeader className="bg-background/50">
                  <CardTitle className="text-xl font-serif text-primary">{process.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 flex-1">
                  <p className="text-sm text-foreground leading-relaxed">{process.description}</p>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Flavor Impact</p>
                    <p className="text-sm text-muted-foreground italic">"{process.flavor_impact}"</p>
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
