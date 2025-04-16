
import { Card, CardContent, CardFooter } from "./ui/card";
import { HeartIcon, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export interface SpaceCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  available: string;
}

export function SpaceCard({
  id,
  title,
  location,
  price,
  rating,
  imageUrl,
  available,
}: SpaceCardProps) {
  return (
    <Card className="rounded-xl overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/spaces/${id}`}>
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
          >
            <HeartIcon className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              <span>{rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-sm text-muted-foreground">{available}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="font-medium">
            R$ {price} <span className="font-normal">/ diária</span>
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
