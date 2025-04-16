
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Search, Globe, Menu, User } from "lucide-react";

export function Header() {
  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-eventspace-500">EventSpace</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 rounded-full border px-3.5 py-1.5 shadow-sm hover:shadow transition-shadow cursor-pointer">
          <span className="text-sm font-medium">Localização</span>
          <span className="text-sm text-muted-foreground px-2 border-x">Data</span>
          <span className="text-sm text-muted-foreground">Convidados</span>
          <Button size="icon" variant="ghost" className="rounded-full bg-primary ml-1">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="rounded-full hidden md:flex">
            Anuncie seu espaço
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Globe className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                <Menu className="h-4 w-4 mr-2" />
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="font-medium">Registrar</DropdownMenuItem>
              <DropdownMenuItem>Entrar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Anuncie seu espaço</DropdownMenuItem>
              <DropdownMenuItem>Painel de Cliente</DropdownMenuItem>
              <DropdownMenuItem>Painel de Anfitrião</DropdownMenuItem>
              <DropdownMenuItem>Painel de Admin</DropdownMenuItem>
              <DropdownMenuItem>Ajuda</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
