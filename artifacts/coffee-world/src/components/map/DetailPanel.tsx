import { useMap } from "@/context/MapContext";
import { X, MapPin, ExternalLink, Award, Sprout, Building2, Globe, Calendar, Leaf, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import FlavorRadar from "@/components/shared/FlavorRadar";
import { getCountries, getFarms, getRoasters } from "@/lib/data";
import { useMemo } from "react";

const ALL_COUNTRIES = getCountries();
const ALL_FARMS     = getFarms();
const ALL_ROASTERS  = getRoasters();

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif font-semibold text-primary mb-3">{children}</h3>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
      {children}
    </h4>
  );
}

function ConnectionCard({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
    >
      <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{sub}</p>
      </div>
    </button>
  );
}

const ROAST_STYLE_COLORS: Record<string, string> = {
  "Light":         "border-amber-400/40 bg-amber-400/10 text-amber-300",
  "Medium-Light":  "border-orange-400/40 bg-orange-400/10 text-orange-300",
  "Medium":        "border-orange-600/40 bg-orange-600/10 text-orange-400",
  "Medium-Dark":   "border-red-500/40 bg-red-500/10 text-red-400",
  "Dark":          "border-red-800/40 bg-red-800/10 text-red-500",
};

const CERT_COLORS: Record<string, string> = {
  "Organic":               "border-green-500/40 bg-green-500/10 text-green-400",
  "Fair Trade":            "border-blue-400/40 bg-blue-400/10 text-blue-300",
  "Rainforest Alliance":   "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  "Shade-Grown":           "border-teal-400/40 bg-teal-400/10 text-teal-300",
  "Carbon Neutral":        "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Direct Trade":          "border-primary/40 bg-primary/10 text-primary",
  "B-Corp":                "border-violet-400/40 bg-violet-400/10 text-violet-300",
  "Wildlife Friendly":     "border-lime-400/40 bg-lime-400/10 text-lime-300",
  "Regenerative Agriculture": "border-green-600/40 bg-green-600/10 text-green-300",
  "UTZ":                   "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

function certClass(cert: string) {
  return CERT_COLORS[cert] ?? "border-border bg-background";
}

export default function DetailPanel() {
  const { selectedEntity, setSelectedEntity } = useMap();

  const entity = useMemo(() => {
    if (!selectedEntity) return null;
    if (selectedEntity.type === "country") return { kind: "country" as const, data: ALL_COUNTRIES.find(c => c.id === selectedEntity.id) };
    if (selectedEntity.type === "farm")    return { kind: "farm"    as const, data: ALL_FARMS.find(f => f.id === selectedEntity.id) };
    if (selectedEntity.type === "roaster") return { kind: "roaster" as const, data: ALL_ROASTERS.find(r => r.id === selectedEntity.id) };
    return null;
  }, [selectedEntity]);

  if (!entity?.data) return null;

  const close = () => setSelectedEntity(null);
  const open  = (type: "country" | "farm" | "roaster", id: string) => setSelectedEntity({ type, id });

  return (
    <div className="w-[400px] h-full bg-card border-l border-border shrink-0 z-40 absolute right-0 top-0 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

      {/* ── Country ─────────────────────────────────────────── */}
      {entity.kind === "country" && (() => {
        const country = entity.data!;
        const farmsHere    = ALL_FARMS.filter(f => f.country.toLowerCase() === country.name.toLowerCase());
        const roastersHere = ALL_ROASTERS.filter(r =>
          r.signature_origins.some(o =>
            o.toLowerCase().includes(country.name.toLowerCase()) ||
            country.name.toLowerCase().includes(o.toLowerCase())
          )
        );
        return (
          <>
            <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{country.flag}</span>
                  <h2 className="text-2xl font-serif font-bold text-primary">{country.name}</h2>
                </div>
                <Badge variant="secondary" className="bg-background text-muted-foreground">{country.region}</Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={close} className="hover:bg-background shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-6 py-6 space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Production</p>
                    <p className="font-medium">{(country.production_bags / 1_000_000).toFixed(1)}M bags/yr</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Harvest</p>
                    <p className="font-medium text-sm">{country.harvest_season}</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-border col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Altitude Range</p>
                    <p className="font-medium">{country.altitude_range}</p>
                  </div>
                </div>
                <div>
                  <SectionTitle>Flavor Profile</SectionTitle>
                  <FlavorRadar data={country.flavor_profile} />
                </div>
                <div className="space-y-4">
                  <div>
                    <SubTitle>Key Varieties</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {country.varieties.map(v => <Badge key={v} variant="outline" className="border-primary/20 bg-primary/5 text-foreground">{v}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <SubTitle>Processing Methods</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {country.processes.map(p => <Badge key={p} variant="outline" className="border-border bg-background">{p}</Badge>)}
                    </div>
                  </div>
                </div>
                {country.sub_regions.length > 0 && (
                  <div>
                    <SubTitle>Growing Regions</SubTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">{country.sub_regions.join(" · ")}</p>
                  </div>
                )}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <p className="text-sm italic leading-relaxed text-secondary-foreground">"{country.fun_fact}"</p>
                </div>
                {farmsHere.length > 0 && (
                  <div>
                    <SectionTitle>Farms in {country.name}</SectionTitle>
                    <div className="space-y-2">
                      {farmsHere.slice(0, 8).map(f => (
                        <ConnectionCard key={f.id} icon={<Sprout className="w-4 h-4" />}
                          label={f.name} sub={`${f.region} · ${f.altitude}m · ${f.processes.slice(0, 2).join(", ")}`}
                          onClick={() => open("farm", f.id)} />
                      ))}
                      {farmsHere.length > 8 && <p className="text-xs text-muted-foreground text-center pt-1">+{farmsHere.length - 8} more farms</p>}
                    </div>
                  </div>
                )}
                {roastersHere.length > 0 && (
                  <div>
                    <SectionTitle>Roasters Sourcing from {country.name}</SectionTitle>
                    <div className="space-y-2">
                      {roastersHere.slice(0, 8).map(r => (
                        <ConnectionCard key={r.id} icon={<Building2 className="w-4 h-4" />}
                          label={r.name} sub={`${r.city}, ${r.country} · est. ${r.founded}`}
                          onClick={() => open("roaster", r.id)} />
                      ))}
                      {roastersHere.length > 8 && <p className="text-xs text-muted-foreground text-center pt-1">+{roastersHere.length - 8} more roasters</p>}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        );
      })()}

      {/* ── Farm ────────────────────────────────────────────── */}
      {entity.kind === "farm" && (() => {
        const farm = entity.data!;

        const homeCountry = ALL_COUNTRIES.find(c => c.name.toLowerCase() === farm.country.toLowerCase());

        // Direct sourced_roasters links first; fall back to country-match
        const directRoasters = (farm.sourced_roasters ?? [])
          .map(id => ALL_ROASTERS.find(r => r.id === id))
          .filter(Boolean) as typeof ALL_ROASTERS;

        const fallbackRoasters = directRoasters.length === 0
          ? ALL_ROASTERS.filter(r =>
              r.signature_origins.some(o =>
                o.toLowerCase().includes(farm.country.toLowerCase()) ||
                farm.country.toLowerCase().includes(o.toLowerCase())
              )
            )
          : [];

        const displayRoasters = directRoasters.length > 0 ? directRoasters : fallbackRoasters;
        const roasterSectionTitle = directRoasters.length > 0
          ? "Roasters Sourcing This Farm"
          : `Roasters Sourcing from ${farm.country}`;

        return (
          <>
            <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-1">{farm.name}</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{farm.region}, {farm.country}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={close} className="hover:bg-background shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-6 py-6 space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Altitude</p>
                    <p className="font-medium">{farm.altitude} masl</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Producer</p>
                    <p className="font-medium text-sm truncate" title={farm.owner}>{farm.owner}</p>
                  </div>
                  {farm.harvest_months && (
                    <div className="bg-background/50 p-3 rounded-lg border border-border col-span-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Harvest</p>
                        <p className="font-medium text-sm">{farm.harvest_months}</p>
                      </div>
                    </div>
                  )}
                </div>

                {farm.sustainability && farm.sustainability.length > 0 && (
                  <div>
                    <SubTitle>Certifications &amp; Sustainability</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.sustainability.map(cert => (
                        <Badge key={cert} variant="outline" className={`text-xs ${certClass(cert)}`}>
                          <Leaf className="w-2.5 h-2.5 mr-1" />{cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {farm.awards && (
                  <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex gap-3 items-center">
                    <Award className="w-7 h-7 text-primary shrink-0" />
                    <p className="text-sm font-medium text-primary-foreground">{farm.awards}</p>
                  </div>
                )}

                <div>
                  <SectionTitle>Tasting Notes</SectionTitle>
                  <p className="text-sm leading-relaxed text-foreground bg-background/30 p-4 rounded-lg border border-border/50">
                    {farm.tasting_notes}
                  </p>
                </div>

                <div>
                  <SectionTitle>Flavor Profile</SectionTitle>
                  <FlavorRadar data={farm.flavor_profile} />
                </div>

                <div className="space-y-4">
                  <div>
                    <SubTitle>Varieties Grown</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.varieties.map(v => <Badge key={v} variant="outline" className="border-primary/20 bg-primary/5 text-foreground">{v}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <SubTitle>Processing Methods</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.processes.map(p => <Badge key={p} variant="outline" className="border-border bg-background">{p}</Badge>)}
                    </div>
                  </div>
                </div>

                {homeCountry && (
                  <div>
                    <SectionTitle>Origin Country</SectionTitle>
                    <ConnectionCard icon={<Globe className="w-4 h-4" />}
                      label={`${homeCountry.flag} ${homeCountry.name}`}
                      sub={`${homeCountry.region} · ${(homeCountry.production_bags / 1_000_000).toFixed(1)}M bags/yr`}
                      onClick={() => open("country", homeCountry.id)} />
                  </div>
                )}

                {displayRoasters.length > 0 && (
                  <div>
                    <SectionTitle>{roasterSectionTitle}</SectionTitle>
                    <div className="space-y-2">
                      {displayRoasters.slice(0, 8).map(r => (
                        <ConnectionCard key={r.id} icon={<Building2 className="w-4 h-4" />}
                          label={r.name} sub={`${r.city}, ${r.country} · est. ${r.founded}`}
                          onClick={() => open("roaster", r.id)} />
                      ))}
                      {displayRoasters.length > 8 && <p className="text-xs text-muted-foreground text-center pt-1">+{displayRoasters.length - 8} more</p>}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        );
      })()}

      {/* ── Roaster ─────────────────────────────────────────── */}
      {entity.kind === "roaster" && (() => {
        const roaster = entity.data!;

        const sourceCountries = ALL_COUNTRIES.filter(c =>
          roaster.signature_origins.some(o =>
            o.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(o.toLowerCase())
          )
        );

        // Direct sourced_farms links (precise), fall back to country-region match
        const directFarms = (roaster.sourced_farms ?? [])
          .map(id => ALL_FARMS.find(f => f.id === id))
          .filter(Boolean) as typeof ALL_FARMS;

        const fallbackFarms = directFarms.length === 0
          ? ALL_FARMS.filter(f => sourceCountries.some(c => c.name.toLowerCase() === f.country.toLowerCase()))
          : [];

        const displayFarms = directFarms.length > 0 ? directFarms : fallbackFarms;
        const farmSectionTitle = directFarms.length > 0 ? "Farms Sourced" : "Farms in Sourcing Regions";

        return (
          <>
            <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-xl font-serif font-bold text-primary mb-1 leading-tight">{roaster.name}</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{roaster.city}, {roaster.country}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={close} className="hover:bg-background shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-6 py-6 space-y-8">
                <div className="flex justify-between items-center bg-background/50 p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Founded</p>
                    <p className="font-medium text-lg">{roaster.founded}</p>
                  </div>
                  {roaster.website && roaster.website !== "#" && (
                    <a href={roaster.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                      Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {roaster.roast_styles && roaster.roast_styles.length > 0 && (
                  <div>
                    <SubTitle>Roast Style</SubTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {roaster.roast_styles.map(s => (
                        <Badge key={s} variant="outline" className={`text-xs ${ROAST_STYLE_COLORS[s] ?? "border-border bg-background"}`}>
                          <Coffee className="w-2.5 h-2.5 mr-1" />{s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <SectionTitle>About</SectionTitle>
                  <p className="text-sm leading-relaxed text-muted-foreground">{roaster.description}</p>
                </div>

                <div>
                  <SectionTitle>Sourcing Approach</SectionTitle>
                  <p className="text-sm leading-relaxed text-foreground bg-background/30 p-4 rounded-lg border border-border/50">
                    {roaster.sourcing}
                  </p>
                </div>

                <div>
                  <SubTitle>Signature Origins</SubTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {roaster.signature_origins.map(o => (
                      <Badge key={o} variant="secondary"
                        className="bg-background text-foreground border border-border hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>

                {roaster.notable_coffees.length > 0 && (
                  <div>
                    <SubTitle>Notable Coffees</SubTitle>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                      {roaster.notable_coffees.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {sourceCountries.length > 0 && (
                  <div>
                    <SectionTitle>Source Countries</SectionTitle>
                    <div className="space-y-2">
                      {sourceCountries.map(c => (
                        <ConnectionCard key={c.id} icon={<Globe className="w-4 h-4" />}
                          label={`${c.flag} ${c.name}`}
                          sub={`${c.region} · ${(c.production_bags / 1_000_000).toFixed(1)}M bags/yr · ${c.altitude_range}`}
                          onClick={() => open("country", c.id)} />
                      ))}
                    </div>
                  </div>
                )}

                {displayFarms.length > 0 && (
                  <div>
                    <SectionTitle>{farmSectionTitle}</SectionTitle>
                    <div className="space-y-2">
                      {displayFarms.slice(0, 8).map(f => (
                        <ConnectionCard key={f.id} icon={<Sprout className="w-4 h-4" />}
                          label={f.name}
                          sub={`${f.region}, ${f.country} · ${f.altitude}m${f.harvest_months ? ` · ${f.harvest_months}` : ""}`}
                          onClick={() => open("farm", f.id)} />
                      ))}
                      {displayFarms.length > 8 && <p className="text-xs text-muted-foreground text-center pt-1">+{displayFarms.length - 8} more</p>}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        );
      })()}
    </div>
  );
}
