import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const FavoritesSection = () => {
  const favoriteSpaces: any[] = []; // TODO: Implement favorites system

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Seus Espaços Favoritos</h2>
      {favoriteSpaces.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent className="pt-6 pb-4">
            <h3 className="text-xl font-medium mb-2">
              Sem favoritos
            </h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não adicionou nenhum espaço aos favoritos.
            </p>
            <Button asChild>
              <Link to="/">Procurar espaços</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteSpaces.map((space) => (
            <Card key={space.id}>
              <div className="aspect-square relative">
                <img
                  src={space.image_url || "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=800&auto=format&fit=crop"}
                  alt={space.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium">{space.title}</h3>
                <p className="text-sm text-muted-foreground">{space.location}</p>
                <p className="text-sm font-medium mt-1">R$ {space.price} / diária</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/spaces/${space.id}`}>Ver disponibilidade</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
