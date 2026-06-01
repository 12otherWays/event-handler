"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 relative">
        <h1 className="text-xl font-bold tracking-tighter text-primary">
          EVENT HANDLER
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
