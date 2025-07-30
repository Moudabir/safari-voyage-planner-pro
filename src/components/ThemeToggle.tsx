import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
export function ThemeToggle() {
  const {
    theme,
    setTheme
  } = useTheme();
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };
  const getIcon = () => {
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    if (theme === "light") return <Sun className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />; // system defaults to sun
  };
  return <Button variant="outline" size="icon" onClick={toggleTheme} title={`Current theme: ${theme}. Click to cycle through themes.`} className="relative text-slate-600 rounded-3xl bg-lime-300 hover:bg-lime-200">
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>;
}