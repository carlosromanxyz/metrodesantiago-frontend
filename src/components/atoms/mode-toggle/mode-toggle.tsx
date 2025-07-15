"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button 
              className="h-10 w-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-metro-red hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 transition-colors rounded-sm cursor-pointer"
              aria-label="Cambiar tema"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 rounded">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <TooltipContent side="bottom">
      Cambiar tema
    </TooltipContent>
  </Tooltip>
  )
}