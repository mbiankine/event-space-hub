
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingSpaceInfoProps {
  space: {
    title: string;
    description: string;
    capacity: number;
    space_type: string;
    price: number;
  } | null;
}

const BookingSpaceInfo = ({ space }: BookingSpaceInfoProps) => {
  if (!space) return null;

  return (
    <>
      <CardHeader className="border-t pt-6">
        <CardTitle>Informações do Espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{space.title}</p>
        <p className="text-muted-foreground line-clamp-2 mb-4">{space.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Capacidade</p>
            <p className="font-medium">{space.capacity} pessoas</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo</p>
            <p className="font-medium">{space.space_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="font-medium">R$ {space.price}</p>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default BookingSpaceInfo;
