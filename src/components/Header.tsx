
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Search, Globe, Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, profile, roles, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full hidden md:flex"
            onClick={() => {
              if (hasRole('host')) {
                navigate('/host/dashboard');
              } else {
                navigate('/auth/register');
              }
            }}
          >
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
              {user ? (
                <>
                  <DropdownMenuItem className="font-medium">
                    {profile?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {hasRole('client') && (
                    <DropdownMenuItem onClick={() => navigate('/client/dashboard')}>
                      Painel de Cliente
                    </DropdownMenuItem>
                  )}
                  
                  {hasRole('host') && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/host/dashboard')}>
                        Painel de Anfitrião
                      </DropdownMenuItem>
                      <DropdownMenuItem>Anuncie seu espaço</DropdownMenuItem>
                    </>
                  )}
                  
                  {hasRole('admin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      Painel de Admin
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sair
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate('/auth/register')}>
                    Registrar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/auth/login')}>
                    Entrar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Anuncie seu espaço</DropdownMenuItem>
                  <DropdownMenuItem>Ajuda</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
