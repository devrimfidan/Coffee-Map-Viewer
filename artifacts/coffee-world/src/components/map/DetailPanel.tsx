import { useMap } from "@/context/MapContext";
import { X, MapPin, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import FlavorRadar from "@/components/shared/FlavorRadar";

export default function DetailPanel() {
  const { selectedEntity, setSelectedEntity, filteredCountries, filteredFarms, filteredRoasters } = useMap();

  if (!selectedEntity) return null;

  let content = null;

  if (selectedEntity.type === 'country') {
    const country = filteredCountries.find(c => c.id === selectedEntity.id);
    if (country) {
      content = (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{country.flag}</span>
                <h2 className="text-2xl font-serif font-bold text-primary">{country.name}</h2>
              </div>
              <Badge variant="secondary" className="bg-background text-muted-foreground">{country.region}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedEntity(null)} className="hover:bg-background">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Production</p>
                  <p className="font-medium">{(country.production_bags / 1000000).toFixed(1)}M bags</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Harvest</p>
                  <p className="font-medium text-sm">{country.harvest_season}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-border col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Altitude</p>
                  <p className="font-medium">{country.altitude_range}</p>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-primary mb-3">Flavor Profile</h3>
                <FlavorRadar data={country.flavor_profile} />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Varieties</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {country.varieties.map(v => <Badge key={v} variant="outline" className="border-primary/20 bg-primary/5 text-foreground">{v}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Processing Methods</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {country.processes.map(p => <Badge key={p} variant="outline" className="border-border bg-background">{p}</Badge>)}
                  </div>
                </div>
              </div>

              {country.sub_regions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Growing Regions</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {country.sub_regions.join(" • ")}
                  </p>
                </div>
              )}

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <p className="text-sm italic leading-relaxed text-secondary-foreground">"{country.fun_fact}"</p>
              </div>

            </div>
          </ScrollArea>
        </div>
      );
    }
  } else if (selectedEntity.type === 'farm') {
    const farm = filteredFarms.find(f => f.id === selectedEntity.id);
    if (farm) {
      content = (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-1">{farm.name}</h2>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{farm.region}, {farm.country}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedEntity(null)} className="hover:bg-background">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Altitude</p>
                  <p className="font-medium">{farm.altitude} masl</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Producer</p>
                  <p className="font-medium text-sm truncate" title={farm.owner}>{farm.owner}</p>
                </div>
              </div>

              {farm.awards && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex gap-3 items-center">
                  <Award className="w-8 h-8 text-primary shrink-0" />
                  <p className="text-sm font-medium text-primary-foreground">{farm.awards}</p>
                </div>
              )}

              <div>
                <h3 className="font-serif font-semibold text-primary mb-3">Tasting Notes</h3>
                <p className="text-sm leading-relaxed text-foreground bg-background/30 p-4 rounded-lg border border-border/50">
                  {farm.tasting_notes}
                </p>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-primary mb-3">Flavor Profile</h3>
                <FlavorRadar data={farm.flavor_profile} />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Varieties Grown</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.varieties.map(v => <Badge key={v} variant="outline" className="border-primary/20 bg-primary/5 text-foreground">{v}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Processing</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.processes.map(p => <Badge key={p} variant="outline" className="border-border bg-background">{p}</Badge>)}
                  </div>
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>
      );
    }
  } else if (selectedEntity.type === 'roaster') {
    const roaster = filteredRoasters.find(r => r.id === selectedEntity.id);
    if (roaster) {
      content = (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-1">{roaster.name}</h2>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{roaster.city}, {roaster.country}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedEntity(null)} className="hover:bg-background">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-8">
              
              <div className="flex justify-between items-center bg-background/50 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Founded</p>
                  <p className="font-medium text-lg">{roaster.founded}</p>
                </div>
                <a href={roaster.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                  Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-primary mb-2">About</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {roaster.description}
                </p>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-primary mb-2">Sourcing Approach</h3>
                <p className="text-sm leading-relaxed text-foreground bg-background/30 p-4 rounded-lg border border-border/50">
                  {roaster.sourcing}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Signature Origins</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {roaster.signature_origins.map(o => <Badge key={o} variant="secondary" className="bg-background text-foreground border border-border hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer">{o}</Badge>)}
                  </div>
                </div>
                {roaster.notable_coffees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notable Coffees</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                      {roaster.notable_coffees.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </ScrollArea>
        </div>
      );
    }
  }

  return (
    <div className={`w-[380px] h-full bg-card border-l border-border shrink-0 z-40 absolute right-0 top-0 shadow-2xl transition-transform duration-300 ease-in-out ${selectedEntity ? 'translate-x-0' : 'translate-x-full'}`}>
      {content}
    </div>
  );
}
