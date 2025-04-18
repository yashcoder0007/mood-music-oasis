
import { useState } from "react";
import { Paintbrush, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

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
    if (shouldBeDark) {
      // Dark theme colors
      root.style.setProperty('--background', convertHexToHSL(scheme.background));
      root.style.setProperty('--primary', convertHexToHSL(scheme.primary));
      root.style.setProperty('--secondary', convertHexToHSL(scheme.secondary));
      root.style.setProperty('--accent', convertHexToHSL(scheme.accent));
    } else {
      // Light theme colors
      root.style.setProperty('--background', convertHexToHSL(scheme.background));
      root.style.setProperty('--primary', convertHexToHSL(scheme.primary));
      root.style.setProperty('--secondary', convertHexToHSL(scheme.secondary));
      root.style.setProperty('--accent', convertHexToHSL(scheme.accent));
    }
    
    setSelectedScheme(scheme.name);
  };

  const resetToDefault = () => {
    const root = document.documentElement;
    root.style.removeProperty('--background');
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    
    setSelectedScheme(null);
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
