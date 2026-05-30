import { Link, useLocation } from "wouter";
import { Coffee, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopNav() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Map" },
    { href: "/encyclopedia", label: "Encyclopedia" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <header className="h-[52px] bg-background border-b border-border flex items-center justify-between px-6 shrink-0 z-50 relative">
      <div className="flex items-center gap-3">
        <Coffee className="w-5 h-5 text-primary" />
        <span className="font-serif font-semibold text-lg text-primary tracking-wide">Coffee World</span>
      </div>

      <nav className="flex items-center gap-1 bg-card/50 p-1 rounded-md border border-border/50">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <span className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all cursor-pointer ${
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search global atlas..." 
            className="w-64 pl-9 bg-card border-border/50 focus-visible:ring-primary/50 text-sm h-8"
          />
        </div>
      </div>
    </header>
  );
}
