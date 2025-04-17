
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalyticsContent } from "./AnalyticsContent";
import { BookingsList } from "./BookingsList";
import { SpacesList } from "./SpacesList";

interface DashboardTabsProps {
  spaces: any[];
}

export const DashboardTabs = ({ spaces }: DashboardTabsProps) => {
  return (
    <div className="col-span-1 lg:col-span-3">
      <Tabs defaultValue="spaces" className="h-full flex flex-col">
        <TabsList>
          <TabsTrigger value="spaces">Meus Espaços</TabsTrigger>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="spaces" className="flex-1 space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Meus Espaços</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/host/spaces">Ver todos</Link>
            </Button>
          </div>
          <SpacesList spaces={spaces} />
        </TabsContent>

        <TabsContent value="bookings" className="flex-1 space-y-4 mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Próximas Reservas</h2>
            <Button variant="outline" asChild>
              <Link to="/host/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Calendário
              </Link>
            </Button>
          </div>
          <BookingsList />
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 space-y-6 mt-4">
          <AnalyticsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
