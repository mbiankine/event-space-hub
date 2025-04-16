
import { Button } from "./ui/button";
import { 
  Building, Warehouse, Tent, Palmtree, Mountain, Building2, 
  Castle, Hotel, Home, Church, Coffee, UtensilsCrossed 
} from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const categories = [
  { name: "Salões de Festa", icon: Building },
  { name: "Espaço para Eventos", icon: Warehouse },
  { name: "Casas de Campo", icon: Home },
  { name: "Espaços ao Ar Livre", icon: Palmtree },
  { name: "Rooftops", icon: Building2 },
  { name: "Salões de Casamento", icon: Church },
  { name: "Casarões", icon: Castle },
  { name: "Restaurantes", icon: UtensilsCrossed },
  { name: "Auditórios", icon: Building },
  { name: "Cafés", icon: Coffee },
  { name: "Hotéis", icon: Hotel },
  { name: "Chalés", icon: Mountain },
  { name: "Tendas", icon: Tent },
];

export function CategoryFilters() {
  return (
    <div className="border-b pb-4">
      <ScrollArea className="px-4 md:px-6 lg:px-8 pb-2 pt-4">
        <div className="flex gap-4 w-max">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className="rounded-full border flex-col h-auto py-2 px-4 gap-2"
            >
              <category.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
