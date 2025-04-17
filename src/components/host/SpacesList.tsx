
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle, Star, Users } from "lucide-react";

interface SpacesListProps {
  spaces: any[];
}

export const SpacesList = ({ spaces }: SpacesListProps) => {
  if (spaces.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardContent className="flex flex-col items-center pt-6">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <PlusCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Adicione seu primeiro espaço</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Comece publicando seu primeiro espaço para eventos e comece a receber reservas.
          </p>
          <Button asChild>
            <Link to="/host/spaces/new">Publicar um espaço</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <Card key={space.id}>
          <div className="aspect-video relative">
            <img
              src="https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"
              alt={space.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>{space.title}</CardTitle>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="text-sm ml-1">4.9</span>
              </div>
            </div>
            <CardDescription>{space.location?.city}, {space.location?.state}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm font-medium">R$ {space.price} / diária</p>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Até {space.capacity} pessoas</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/host/spaces/${space.id}/edit`}>Editar</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/host/spaces/${space.id}/calendar`}>Agenda</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/host/spaces/${space.id}/analytics`}>Estatísticas</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
