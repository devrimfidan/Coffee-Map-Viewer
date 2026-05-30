import { useState, useMemo } from "react";
import { getCountries, getFarms, getVarieties } from "@/lib/data";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";

type EntityType = 'country' | 'farm' | 'variety';

export default function Compare() {
  const countries = useMemo(() => getCountries(), []);
  const farms = useMemo(() => getFarms(), []);
  const varieties = useMemo(() => getVarieties(), []);

  const [item1Id, setItem1Id] = useState<string>("hacienda-la-esmeralda");
  const [item2Id, setItem2Id] = useState<string>("kieni-factory");

  const getItem = (id: string) => {
    let item: any = countries.find(c => c.id === id);
    if (item) return { ...item, type: 'country' as EntityType, displayName: `${item.flag} ${item.name}` };
    
    item = farms.find(f => f.id === id);
    if (item) return { ...item, type: 'farm' as EntityType, displayName: `${item.name} (${item.country})` };
    
    item = varieties.find(v => v.id === id);
    if (item) return { ...item, type: 'variety' as EntityType, displayName: item.name };
    
    return null;
  };

  const item1 = getItem(item1Id);
  const item2 = getItem(item2Id);

  const radarData = useMemo(() => {
    if (!item1 || !item2) return [];
    
    const axes = ["acidity", "body", "sweetness", "fruity", "earthy", "roasted"];
    return axes.map(axis => ({
      subject: axis.charAt(0).toUpperCase() + axis.slice(1),
      A: item1.flavor_profile[axis as keyof typeof item1.flavor_profile],
      B: item2.flavor_profile[axis as keyof typeof item2.flavor_profile],
      fullMark: 10,
    }));
  }, [item1, item2]);

  return (
    <div className="h-full w-full p-6 md:p-12 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Compare Profiles</h1>
          <p className="text-lg text-muted-foreground">Overlay flavor profiles and statistics from different origins, farms, and varieties to understand their unique characteristics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary uppercase tracking-wider">Item 1 (Gold)</label>
            <Select value={item1Id} onValueChange={setItem1Id}>
              <SelectTrigger className="w-full bg-card border-primary/30 h-12 text-lg focus:ring-primary/50">
                <SelectValue placeholder="Select first item" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                <SelectGroup>
                  <SelectLabel>Varieties</SelectLabel>
                  {varieties.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Farms</SelectLabel>
                  {farms.map(f => <SelectItem key={f.id} value={f.id}>{f.name} ({f.country})</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  {countries.map(c => <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#00704A] uppercase tracking-wider">Item 2 (Green)</label>
            <Select value={item2Id} onValueChange={setItem2Id}>
              <SelectTrigger className="w-full bg-card border-[#00704A]/30 h-12 text-lg focus:ring-[#00704A]/50">
                <SelectValue placeholder="Select second item" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                <SelectGroup>
                  <SelectLabel>Varieties</SelectLabel>
                  {varieties.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Farms</SelectLabel>
                  {farms.map(f => <SelectItem key={f.id} value={f.id}>{f.name} ({f.country})</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  {countries.map(c => <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {item1 && item2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card/50 p-8 rounded-xl border border-border">
            
            <div className="h-[400px] w-full bg-background/50 rounded-full border border-border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Radar
                    name={item1.displayName}
                    dataKey="A"
                    stroke="#C8A96E"
                    fill="#C8A96E"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name={item2.displayName}
                    dataKey="B"
                    stroke="#00704A"
                    fill="#00704A"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-foreground border-b border-border pb-2">Key Attributes</h3>
              
              <div className="space-y-4">
                {[
                  { label: "Type", k: "type", fmt: (v: string) => <span className="capitalize">{v}</span> },
                  { label: "Origin / Country", k: "country", altK: "origin", fmt: (v: string) => v || "N/A" },
                  { label: "Altitude", k: "altitude", altK: "altitude_range", fmt: (v: string | number) => v ? `${v} ${typeof v === 'number' ? 'masl' : ''}` : "Varies" },
                ].map((stat, i) => {
                  const val1 = item1[stat.k] || item1[stat.altK];
                  const val2 = item2[stat.k] || item2[stat.altK];
                  
                  return (
                    <div key={i} className="grid grid-cols-3 gap-4 items-center p-3 bg-background/30 rounded-lg">
                      <div className="text-right text-[#C8A96E] font-medium">{stat.fmt(val1)}</div>
                      <div className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                      <div className="text-left text-[#00704A] font-medium">{stat.fmt(val2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
