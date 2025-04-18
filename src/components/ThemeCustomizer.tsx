
import { useState, useEffect } from "react";
import { Paintbrush, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

interface ColorScheme {
  name: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  fontShades: "light" | "dark";
}

const colorSchemes: ColorScheme[] = [
  {
    name: "Purple (Default)",
    background: "#F7F7FD", // Light lavender
    primary: "#9b87f5",
    secondary: "#e2e8f0",
    accent: "#f5e3ff",
    fontShades: "dark"
  },
  {
    name: "Ocean Blue",
    background: "#eef5ff",
    primary: "#0ea5e9",
    secondary: "#e0f2fe",
    accent: "#bae6fd",
    fontShades: "dark"
  },
  {
    name: "Emerald",
    background: "#ecfdf5",
    primary: "#10b981",
    secondary: "#d1fae5",
    accent: "#a7f3d0",
    fontShades: "dark"
  },
  {
    name: "Amber",
    background: "#fffbeb",
    primary: "#f59e0b",
    secondary: "#fef3c7",
    accent: "#fde68a",
    fontShades: "dark"
  },
  {
    name: "Rose",
    background: "#fff1f2",
    primary: "#e11d48",
    secondary: "#ffe4e6",
    accent: "#fecdd3",
    fontShades: "dark"
  },
  {
    name: "Dark Purple",
    background: "#1e1b4b",
    primary: "#a78bfa",
    secondary: "#312e81",
    accent: "#4338ca",
    fontShades: "light"
  },
  {
    name: "Dark Blue",
    background: "#172554",
    primary: "#60a5fa",
    secondary: "#1e3a8a",
    accent: "#1d4ed8",
    fontShades: "light"
  },
  {
    name: "Dark Green",
    background: "#14432a",
    primary: "#4ade80",
    secondary: "#166534",
    accent: "#15803d", 
    fontShades: "light"
  }
];

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const { toast } = useToast();

  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    
    const isAlreadyDark = theme === 'dark';
    const shouldBeDark = scheme.fontShades === 'light';
    
    // Change theme between dark/light based on the color scheme
    if (shouldBeDark && !isAlreadyDark) {
      setTheme('dark');
    } else if (!shouldBeDark && isAlreadyDark) {
      setTheme('light');
    }
    
    // Apply the custom colors as CSS variables
    root.style.setProperty('--background', convertHexToHSL(scheme.background));
    root.style.setProperty('--primary', convertHexToHSL(scheme.primary));
    root.style.setProperty('--secondary', convertHexToHSL(scheme.secondary));
    root.style.setProperty('--accent', convertHexToHSL(scheme.accent));
    
    // Apply to card, button, and other UI elements
    if (shouldBeDark) {
      // Dark theme complementary colors
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--card', convertHexToHSL(adjustColor(scheme.background, 5)));
      root.style.setProperty('--card-foreground', '0 0% 98%');
      root.style.setProperty('--popover', convertHexToHSL(adjustColor(scheme.background, 5)));
      root.style.setProperty('--popover-foreground', '0 0% 98%');
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      root.style.setProperty('--secondary-foreground', '0 0% 98%');
      root.style.setProperty('--accent-foreground', '0 0% 98%');
      root.style.setProperty('--muted', convertHexToHSL(adjustColor(scheme.secondary, -10)));
      root.style.setProperty('--muted-foreground', '240 5% 84.9%');
      root.style.setProperty('--border', convertHexToHSL(adjustColor(scheme.secondary, 10)));
    } else {
      // Light theme complementary colors
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--primary-foreground', '210 40% 98%');
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--muted', convertHexToHSL(adjustColor(scheme.secondary, -5)));
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--border', convertHexToHSL(adjustColor(scheme.secondary, -10)));
    }
    
    // Also set sidebar colors to match the theme
    root.style.setProperty('--sidebar-background', convertHexToHSL(scheme.background));
    root.style.setProperty('--sidebar-foreground', shouldBeDark ? '0 0% 98%' : '240 5.3% 26.1%');
    root.style.setProperty('--sidebar-primary', convertHexToHSL(scheme.primary));
    root.style.setProperty('--sidebar-primary-foreground', shouldBeDark ? '0 0% 100%' : '0 0% 98%');
    root.style.setProperty('--sidebar-accent', convertHexToHSL(scheme.accent));
    root.style.setProperty('--sidebar-accent-foreground', shouldBeDark ? '0 0% 98%' : '240 5.9% 10%');
    
    toast({
      title: "Theme Applied",
      description: `Applied the ${scheme.name} theme to your entire application`,
    });
    
    setSelectedScheme(scheme.name);
    
    // Store the selected scheme in local storage for persistence
    localStorage.setItem('moodcraft-theme', JSON.stringify({
      name: scheme.name,
      colors: {
        background: scheme.background,
        primary: scheme.primary,
        secondary: scheme.secondary,
        accent: scheme.accent,
        fontShades: scheme.fontShades
      }
    }));
  };

  // Load theme from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('moodcraft-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        const matchedScheme = colorSchemes.find(scheme => scheme.name === parsedTheme.name);
        if (matchedScheme) {
          applyColorScheme(matchedScheme);
        }
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    }
  }, []);

  const resetToDefault = () => {
    const root = document.documentElement;
    root.style.removeProperty('--background');
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--card');
    root.style.removeProperty('--card-foreground');
    root.style.removeProperty('--popover');
    root.style.removeProperty('--popover-foreground');
    root.style.removeProperty('--primary-foreground');
    root.style.removeProperty('--secondary-foreground');
    root.style.removeProperty('--accent-foreground');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--muted-foreground');
    root.style.removeProperty('--border');
    
    // Reset sidebar colors
    root.style.removeProperty('--sidebar-background');
    root.style.removeProperty('--sidebar-foreground');
    root.style.removeProperty('--sidebar-primary');
    root.style.removeProperty('--sidebar-primary-foreground');
    root.style.removeProperty('--sidebar-accent');
    root.style.removeProperty('--sidebar-accent-foreground');
    
    // Clear from local storage
    localStorage.removeItem('moodcraft-theme');
    
    setTheme('light');
    setSelectedScheme(null);
    
    toast({
      title: "Reset Complete",
      description: "Your theme has been reset to default",
    });
  };
  
  // Helper function to convert hex to HSL format for CSS variables
  const convertHexToHSL = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find min and max RGB values
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    
    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };
  
  // Helper function to adjust color brightness/darkness
  const adjustColor = (hex: string, percent: number): string => {
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust values
    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));
    
    // Convert back to hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" title="Customize Theme">
          <Paintbrush className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize Theme</SheetTitle>
          <SheetDescription>
            Select a color scheme or create your own custom theme.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <h3 className="text-sm font-medium mb-4">Color Schemes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorSchemes.map((scheme) => (
              <Button
                key={scheme.name}
                variant="outline"
                className={`h-auto justify-start gap-4 p-4 ${
                  selectedScheme === scheme.name ? "border-2 border-primary" : ""
                }`}
                onClick={() => applyColorScheme(scheme)}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: scheme.primary }}
                    ></div>
                    <span className="text-sm font-medium">{scheme.name}</span>
                    {selectedScheme === scheme.name && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div 
                      className="h-4 w-8 rounded-sm"
                      style={{ backgroundColor: scheme.background }}
                    ></div>
                    <div 
                      className="h-4 w-8 rounded-sm"
                      style={{ backgroundColor: scheme.secondary }}
                    ></div>
                    <div 
                      className="h-4 w-8 rounded-sm"
                      style={{ backgroundColor: scheme.accent }}
                    ></div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={resetToDefault}
          >
            <X className="h-4 w-4" /> Reset to Default
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
