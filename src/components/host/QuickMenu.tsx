
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, Calendar, Home, ListChecks, 
  MessageCircle, PlusCircle, Settings 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const QuickMenu = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Menu Rápido</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 p-2">
          <Button 
            variant={isActive("/host/dashboard") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/dashboard">
              <Home className="mr-2 h-5 w-5" /> Dashboard
            </Link>
          </Button>
          <Button 
            variant={isActive("/host/spaces") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/spaces">
              <ListChecks className="mr-2 h-5 w-5" /> Meus Espaços
            </Link>
          </Button>
          <Button 
            variant={isActive("/host/bookings") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/bookings">
              <Calendar className="mr-2 h-5 w-5" /> Reservas
            </Link>
          </Button>
          <Button 
            variant={isActive("/host/messages") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/messages">
              <MessageCircle className="mr-2 h-5 w-5" /> Mensagens
            </Link>
          </Button>
          <Button 
            variant={isActive("/host/analytics") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/analytics">
              <BarChart3 className="mr-2 h-5 w-5" /> Análises
            </Link>
          </Button>
          <Button 
            variant={isActive("/host/settings") ? "default" : "ghost"} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/host/settings">
              <Settings className="mr-2 h-5 w-5" /> Configurações
            </Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isActive("/host/spaces/new") ? "default" : "outline"} 
          asChild
        >
          <Link to="/host/spaces/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Espaço
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
