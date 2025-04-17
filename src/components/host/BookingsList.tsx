
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";

export const BookingsList = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Salão Espaço Prime</CardTitle>
              <CardDescription>Aniversário de 15 anos</CardDescription>
            </div>
            <div className="text-right">
              <p className="font-medium">R$ 1.200</p>
              <p className="text-sm text-muted-foreground">Cliente: Maria Santos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">15 de Maio, 2023</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">18:00 - 23:00</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">100 convidados</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Mensagem</Button>
          <Button>Detalhes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
