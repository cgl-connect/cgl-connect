"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:w-1/3">
          <Search className="h-5 w-5 text-slate-500" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
