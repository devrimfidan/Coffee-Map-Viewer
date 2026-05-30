import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { FlavorProfile } from "@/lib/data";

interface FlavorRadarProps {
  data: FlavorProfile;
}

export default function FlavorRadar({ data }: FlavorRadarProps) {
  const chartData = [
    { subject: "Acidity", A: data.acidity, fullMark: 10 },
    { subject: "Body", A: data.body, fullMark: 10 },
    { subject: "Sweetness", A: data.sweetness, fullMark: 10 },
    { subject: "Fruity", A: data.fruity, fullMark: 10 },
    { subject: "Earthy", A: data.earthy, fullMark: 10 },
    { subject: "Roasted", A: data.roasted, fullMark: 10 },
  ];

  return (
    <div className="w-full h-64 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-sans)" }} 
          />
          <Radar
            name="Flavor"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
