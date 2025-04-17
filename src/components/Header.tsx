
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe, Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";

export function Header() {
  const { user, profile, accountType, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-eventspace-500">EventSpace</span>
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {!user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full hidden md:flex"
              onClick={() => navigate('/auth/register?type=host')}
            >
              Anuncie seu espaço
            </Button>
          )}
          
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
                    {accountType && (
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {accountType === 'client' ? 'Cliente' : accountType === 'host' ? 'Anfitrião' : 'Admin'}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {accountType === 'client' && (
                    <DropdownMenuItem onClick={() => navigate('/client/dashboard')}>
                      Painel de Cliente
                    </DropdownMenuItem>
                  )}
                  
                  {accountType === 'host' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/host/dashboard')}>
                        Painel de Anfitrião
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/host/spaces')}>
                        Meus Espaços
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/host/spaces/new')}>
                        Anunciar novo espaço
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {accountType === 'admin' && (
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
                  <DropdownMenuItem onClick={() => navigate('/auth/register?type=host')}>
                    Anuncie seu espaço
                  </DropdownMenuItem>
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
