import { useMap } from "@/context/MapContext";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Sidebar() {
  const { filters, setFilters, filteredCountries, filteredFarms, filteredRoasters, setSelectedEntity } = useMap();

  const handleLayerToggle = (layer: keyof typeof filters.layers) => {
    setFilters(prev => ({
      ...prev,
      layers: { ...prev.layers, [layer]: !prev.layers[layer] }
    }));
  };

  const handleVarietyToggle = (variety: string) => {
    setFilters(prev => ({
      ...prev,
      varieties: prev.varieties.includes(variety)
        ? prev.varieties.filter(v => v !== variety)
        : [...prev.varieties, variety]
    }));
  };

  const handleProcessToggle = (process: string) => {
    setFilters(prev => ({
      ...prev,
      processes: prev.processes.includes(process)
        ? prev.processes.filter(p => p !== process)
        : [...prev.processes, process]
    }));
  };

  return (
    <div className="w-[280px] h-full bg-sidebar border-r border-border shrink-0 flex flex-col z-40 relative shadow-xl">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search map..." 
            className="pl-9 bg-background/50 border-border"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Layers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Map Layers</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="layer-belt" checked disabled />
                <Label htmlFor="layer-belt" className="text-sm cursor-not-allowed opacity-70">Coffee Belt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="layer-regions" checked={filters.layers.growingRegions} onCheckedChange={() => handleLayerToggle('growingRegions')} />
                <Label htmlFor="layer-regions" className="text-sm cursor-pointer hover:text-primary transition-colors">Growing Regions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="layer-farms" checked={filters.layers.farms} onCheckedChange={() => handleLayerToggle('farms')} />
                <Label htmlFor="layer-farms" className="text-sm cursor-pointer hover:text-primary transition-colors">Farms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="layer-roasters" checked={filters.layers.roasters} onCheckedChange={() => handleLayerToggle('roasters')} />
                <Label htmlFor="layer-roasters" className="text-sm cursor-pointer hover:text-primary transition-colors">Roasters</Label>
              </div>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["region", "varieties", "processes", "altitude"]}>
            
            <AccordionItem value="region" className="border-border">
              <AccordionTrigger className="text-sm hover:text-primary py-3">Region</AccordionTrigger>
              <AccordionContent>
                <Select value={filters.region} onValueChange={(val) => setFilters(prev => ({ ...prev, region: val }))}>
                  <SelectTrigger className="w-full bg-background border-border">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Regions">All Regions</SelectItem>
                    <SelectItem value="Africa">Africa</SelectItem>
                    <SelectItem value="Central America">Central America</SelectItem>
                    <SelectItem value="South America">South America</SelectItem>
                    <SelectItem value="Asia/Pacific">Asia/Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="varieties" className="border-border">
              <AccordionTrigger className="text-sm hover:text-primary py-3">Varieties</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Arabica", "Robusta", "Gesha", "Bourbon", "Typica", "SL28", "Caturra", "Catuai", "Pacamara", "Heirloom"].map(v => (
                    <Badge 
                      key={v}
                      variant={filters.varieties.includes(v) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => handleVarietyToggle(v)}
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="processes" className="border-border">
              <AccordionTrigger className="text-sm hover:text-primary py-3">Process</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Washed", "Natural", "Honey", "Anaerobic", "Wet-Hulled"].map(p => (
                    <Badge 
                      key={p}
                      variant={filters.processes.includes(p) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => handleProcessToggle(p)}
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="altitude" className="border-border">
              <AccordionTrigger className="text-sm hover:text-primary py-3">Altitude</AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 px-2 pb-2">
                  <Slider 
                    defaultValue={[0, 3000]} 
                    max={3000} 
                    step={100}
                    value={filters.altitude}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, altitude: val as [number, number] }))}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{filters.altitude[0]}m</span>
                    <span>{filters.altitude[1]}m</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

        </div>
      </ScrollArea>
    </div>
  );
}
