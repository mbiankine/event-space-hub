
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalyticsContent } from "./AnalyticsContent";
import { BookingsList } from "./BookingsList";
import { SpacesList } from "./SpacesList";
import { Booking } from "@/types/BookingTypes";

interface DashboardTabsProps {
  spaces: any[];
  bookings: Booking[];
  isLoading: boolean;
}

export const DashboardTabs = ({ spaces, bookings, isLoading }: DashboardTabsProps) => {
  if (isLoading) {
    return (
      <div className="col-span-1 lg:col-span-3 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-3">
      <Tabs defaultValue="spaces" className="h-full flex flex-col">
        <div className="flex justify-between items-start">
          <TabsList>
            <TabsTrigger value="spaces">Meus Espaços</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="spaces" className="flex-1 space-y-4 mt-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-left">Meus Espaços</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/host/spaces" className="flex items-center">Ver todos</Link>
            </Button>
          </div>
          <SpacesList spaces={spaces} />
        </TabsContent>

        <TabsContent value="bookings" className="flex-1 space-y-4 mt-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-left">Próximas Reservas</h2>
            <Button variant="outline" asChild>
              <Link to="/host/bookings" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Calendário
              </Link>
            </Button>
          </div>
          <BookingsList bookings={bookings} />
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 space-y-6 mt-4 text-left">
          <AnalyticsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
