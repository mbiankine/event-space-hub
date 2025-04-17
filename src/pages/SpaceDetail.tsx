
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Wifi, Music, UtensilsCrossed, ParkingCircle, Tv, Volume2, Users, Clock, Star, Share, Heart, ArrowLeft,
  Check, CheckCircle2, CalendarIcon, Car, Lightbulb, Sofa, ShieldCheck, Accessibility
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from "@/components/host/LoadingState";
import { format, isWithinInterval, parse, addHours, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  guests: z.number().min(1, { message: "Mínimo 1 convidado" }).max(1000, { message: "Máximo 1000 convidados" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  hours: z.number().min(1, { message: "Mínimo 1 hora" }).max(24, { message: "Máximo 24 horas" }),
  eventType: z.string().min(1, { message: "Tipo de evento é obrigatório" }),
  notes: z.string().optional(),
  bookingType: z.enum(["hourly", "daily"]),
  days: z.number().min(1, { message: "Mínimo 1 dia" }).max(30, { message: "Máximo 30 dias" }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const SpaceDetail = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [space, setSpace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHours, setSelectedHours] = useState(4);
  const [selectedDays, setSelectedDays] = useState(1);
  const [bookingType, setBookingType] = useState<"hourly" | "daily">("hourly");
  const [guests, setGuests] = useState(25);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      guests: 25,
      date: new Date(),
      hours: 4,
      days: 1,
      eventType: "",
      notes: "",
      bookingType: "hourly",
    },
  });
  
  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setSpace(data);
        
        // After loading space, process available dates
        if (data.availability && data.availability.length > 0) {
          const availableDatesArray = data.availability.map((dateStr: string) => new Date(dateStr));
          setAvailableDates(availableDatesArray);
        }
        
        // Load existing bookings for this space
        await loadBookings(data.id);
      } catch (error) {
        console.error('Error fetching space:', error);
        // Navigate back if space not found
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id, navigate]);
  
  // Load existing bookings to check availability
  const loadBookings = async (spaceId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date')
        .eq('space_id', spaceId)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const dates = data.map(booking => new Date(booking.booking_date));
        setUnavailableDates(dates);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Function to get image URLs from Supabase Storage
  const getImageUrls = (space: any) => {
    if (!space || !space.images) return [];
    
    return space.images.map((imagePath: string) => {
      const { data } = supabase.storage
        .from('spaces')
        .getPublicUrl(imagePath);
      return data.publicUrl;
    });
  };
  
  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // If space has availability settings, check if this date is in the available dates
    if (availableDates.length > 0) {
      return availableDates.some(availableDate => 
        format(availableDate, 'yyyy-MM-dd') === dateStr
      );
    }
    
    // Check if date is not in unavailableDates (bookings)
    return !unavailableDates.some(unavailableDate => 
      format(unavailableDate, 'yyyy-MM-dd') === dateStr
    );
  };
  
  const handleBookNow = () => {
    if (!user) {
      // If user is not logged in, show auth modal
      setIsAuthModalOpen(true);
      return;
    }
    
    // If user is logged in, proceed with booking
    proceedWithBooking();
  };
  
  const proceedWithBooking = () => {
    // Pre-fill form with current selections
    form.setValue('date', date || new Date());
    form.setValue('guests', guests);
    form.setValue('hours', selectedHours);
    form.setValue('days', selectedDays);
    form.setValue('email', user?.email || '');
    form.setValue('bookingType', bookingType);
    
    // Open booking form
    setIsAuthModalOpen(false);
    setIsBookingModalOpen(true);
  };
  
  const redirectToLogin = () => {
    // Close auth modal
    setIsAuthModalOpen(false);
    // Redirect to login page
    navigate("/auth/login");
  };
  
  const redirectToRegister = () => {
    // Close auth modal
    setIsAuthModalOpen(false);
    // Redirect to register page
    navigate("/auth/register");
  };
  
  const onSubmit = async (values: BookingFormValues) => {
    if (!space || !user) return;
    
    setIsSubmitting(true);
    try {
      // Calculate pricing based on booking type
      let basePrice = 0;
      
      if (values.bookingType === 'hourly') {
        basePrice = (space.hourly_price || 0) * values.hours;
      } else {
        basePrice = space.price * (values.days || 1);
      }
      
      // No service fee as requested
      const totalPrice = basePrice;
      
      // Create booking in database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          space_id: space.id,
          client_id: user.id,
          host_id: space.host_id,
          booking_date: format(values.date, 'yyyy-MM-dd'),
          start_time: '10:00', // Default start time
          end_time: values.bookingType === 'hourly' ? 
            format(addHours(parse('10:00', 'HH:mm', new Date()), values.hours), 'HH:mm') : 
            undefined,
          guest_count: values.guests,
          event_type: values.eventType,
          notes: values.notes,
          client_name: values.name,
          client_email: values.email,
          client_phone: values.phone,
          space_title: space.title,
          space_price: basePrice,
          service_fee: 0, // No service fee as requested
          total_price: totalPrice,
          status: 'pending',
          payment_status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      // Show success message
      toast.success("Reserva realizada com sucesso!", {
        description: "O anfitrião receberá sua solicitação e entrará em contato."
      });
      
      // Close modal and reset form
      setIsBookingModalOpen(false);
      form.reset();
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Erro ao fazer reserva", {
        description: "Não foi possível processar sua reserva. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6 flex items-center justify-center">
        <LoadingState />
      </main>
      <Footer />
    </div>
  );
  
  if (!space) return null;
  
  const imageUrls = getImageUrls(space);
  
  // Helper function to map amenities to icons
  const getAmenityIcon = (amenity: string) => {
    const amenityMap: Record<string, React.ReactNode> = {
      "wifi": <Wifi className="h-5 w-5" />,
      "sound": <Music className="h-5 w-5" />,
      "catering": <UtensilsCrossed className="h-5 w-5" />,
      "parking": <Car className="h-5 w-5" />,
      "furniture": <Sofa className="h-5 w-5" />,
      "lighting": <Lightbulb className="h-5 w-5" />,
      "security": <ShieldCheck className="h-5 w-5" />,
      "accessibility": <Accessibility className="h-5 w-5" />,
    };
    
    return amenityMap[amenity] || <Wifi className="h-5 w-5" />;
  };
  
  // Calculate total price based on pricing type and booking type
  const calculatePrice = () => {
    if (bookingType === 'hourly' && space.hourly_price) {
      return space.hourly_price * selectedHours;
    } else if (bookingType === 'daily') {
      return space.price * selectedDays;
    }
    return space.price;
  };
  
  // No service fee as requested
  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen flex flex-col text-left">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">{space.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9</span>
            <span className="mx-1">·</span>
            <span className="underline">Novo</span>
            <span className="mx-1">·</span>
            <span>{space.location.city}, {space.location.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Heart className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
          {imageUrls.length > 0 ? (
            <>
              <div className="md:col-span-2 row-span-2">
                <img
                  src={imageUrls[0]}
                  alt={space.title}
                  className="w-full h-full object-cover rounded-l-xl"
                />
              </div>
              {imageUrls.slice(1, 5).map((url: string, index: number) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`${space.title} ${index + 1}`}
                    className={`w-full h-full object-cover ${index === 0 ? 'rounded-tr-xl' : index === 3 ? 'rounded-br-xl' : ''}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="md:col-span-4 aspect-video">
              <img
                src="https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop"
                alt={space.title}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Espaço inteiro hospedado por Anfitrião</h2>
                <p className="text-muted-foreground">
                  Até {space.capacity} pessoas
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Sobre o espaço</h3>
              <p className="text-muted-foreground">{space.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">O que este lugar oferece</h3>
              <div className="grid grid-cols-2 gap-4">
                {space.amenities && space.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>
                  {space.pricing_type === 'hourly' 
                    ? `R$ ${space.hourly_price} por hora`
                    : space.pricing_type === 'both' 
                      ? `R$ ${space.price} por dia / R$ ${space.hourly_price} por hora`
                      : `R$ ${space.price} por dia`}
                </CardTitle>
                <CardDescription>
                  Escolha como deseja reservar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Pricing Type Selection */}
                {space.pricing_type === 'both' && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Tipo de Reserva</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={bookingType === "hourly" ? "default" : "outline"} 
                        onClick={() => setBookingType("hourly")}
                        className="w-full"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Por Hora
                      </Button>
                      <Button 
                        variant={bookingType === "daily" ? "default" : "outline"} 
                        onClick={() => setBookingType("daily")}
                        className="w-full"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Por Dia
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Selecione a data</h4>
                  <div className="border rounded-md p-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="p-3 pointer-events-auto"
                          fromDate={new Date()}
                          disabled={(date) => !isDateAvailable(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Convidados</h4>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>Convidados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setGuests(prev => Math.max(1, prev - 25))}
                        disabled={guests <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{guests}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setGuests(prev => Math.min(space.capacity, prev + 25))}
                        disabled={guests >= space.capacity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                {bookingType === 'hourly' ? (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Duração em horas</h4>
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>Horas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setSelectedHours(prev => Math.max(1, prev - 1))}
                          disabled={selectedHours <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{selectedHours}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setSelectedHours(prev => Math.min(24, prev + 1))}
                          disabled={selectedHours >= 24}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Duração em dias</h4>
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        <span>Dias</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setSelectedDays(prev => Math.max(1, prev - 1))}
                          disabled={selectedDays <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{selectedDays}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setSelectedDays(prev => Math.min(30, prev + 1))}
                          disabled={selectedDays >= 30}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>
                      {bookingType === 'hourly' 
                        ? `R$ ${space.hourly_price} x ${selectedHours} horas`
                        : `R$ ${space.price} x ${selectedDays} ${selectedDays > 1 ? 'dias' : 'dia'}`}
                    </span>
                    <span>R$ {calculatePrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBookNow}>Reservar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Authentication Modal */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Faça login para continuar</DialogTitle>
              <DialogDescription>
                Para reservar um espaço é necessário ter uma conta. Por favor, entre com sua conta ou crie uma nova.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button className="w-full" onClick={redirectToLogin}>
                Entrar com minha conta
              </Button>
              <Button variant="outline" className="w-full" onClick={redirectToRegister}>
                Criar uma nova conta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Booking Form Modal */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Reservar {space.title}</CardTitle>
                <CardDescription>
                  Preencha os dados para finalizar sua reserva
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="seu.email@exemplo.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bookingType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Tipo de Reserva</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                disabled={space.pricing_type !== 'both'}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem 
                                    value="hourly" 
                                    id="booking-hourly"
                                    disabled={space.pricing_type === 'daily'}
                                  />
                                  <label htmlFor="booking-hourly" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Por Hora
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem 
                                    value="daily" 
                                    id="booking-daily"
                                    disabled={space.pricing_type === 'hourly'}
                                  />
                                  <label htmlFor="booking-daily" className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Por Diária
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data do evento</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "dd 'de' MMMM, yyyy", { locale: ptBR })
                                      ) : (
                                        <span>Escolha uma data</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => !isDateAvailable(date)}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de evento</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="">Selecione o tipo de evento</option>
                                  <option value="Casamento">Casamento</option>
                                  <option value="Aniversário">Aniversário</option>
                                  <option value="Corporativo">Corporativo</option>
                                  <option value="Formatura">Formatura</option>
                                  <option value="Outro">Outro</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="guests"
                          render={({ field: { onChange, ...rest } }) => (
                            <FormItem>
                              <FormLabel>Número de convidados</FormLabel>
                              <FormControl>
                                <div className="flex items-center border rounded-md h-10">
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    className="h-full px-3" 
                                    onClick={() => {
                                      const newValue = Math.max(1, rest.value - 10);
                                      onChange(newValue);
                                    }}
                                  >
                                    -
                                  </Button>
                                  <Input 
                                    className="border-none text-center" 
                                    type="number"
                                    onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                    {...rest}
                                  />
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    className="h-full px-3" 
                                    onClick={() => {
                                      const newValue = Math.min(space.capacity, rest.value + 10);
                                      onChange(newValue);
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch('bookingType') === 'hourly' ? (
                          <FormField
                            control={form.control}
                            name="hours"
                            render={({ field: { onChange, ...rest } }) => (
                              <FormItem>
                                <FormLabel>Duração (horas)</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md h-10">
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      className="h-full px-3" 
                                      onClick={() => {
                                        const newValue = Math.max(1, rest.value - 1);
                                        onChange(newValue);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Input 
                                      className="border-none text-center" 
                                      type="number"
                                      min={1}
                                      max={24}
                                      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                      {...rest}
                                    />
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      className="h-full px-3" 
                                      onClick={() => {
                                        const newValue = Math.min(24, rest.value + 1);
                                        onChange(newValue);
                                      }}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="days"
                            render={({ field: { onChange, ...rest } }) => (
                              <FormItem>
                                <FormLabel>Duração (dias)</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md h-10">
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      className="h-full px-3" 
                                      onClick={() => {
                                        const newValue = Math.max(1, rest.value || 1 - 1);
                                        onChange(newValue);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Input 
                                      className="border-none text-center" 
                                      type="number"
                                      min={1}
                                      max={30}
                                      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                      {...rest}
                                    />
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      className="h-full px-3" 
                                      onClick={() => {
                                        const newValue = Math.min(30, (rest.value || 1) + 1);
                                        onChange(newValue);
                                      }}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações para o anfitrião</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Compartilhe detalhes sobre seu evento ou necessidades especiais"
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          {form.watch('bookingType') === 'hourly' 
                            ? `R$ ${space.hourly_price} x ${form.watch('hours')} horas`
                            : `R$ ${space.price} x ${form.watch('days') || 1} ${(form.watch('days') || 1) > 1 ? 'dias' : 'dia'}`}
                        </span>
                        <span>R$ {
                          form.watch('bookingType') === 'hourly' 
                            ? (space.hourly_price * form.watch('hours')).toFixed(2)
                            : (space.price * (form.watch('days') || 1)).toFixed(2)
                        }</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>R$ {(
                        form.watch('bookingType') === 'hourly' 
                          ? (space.hourly_price * form.watch('hours'))
                          : (space.price * (form.watch('days') || 1))
                      ).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsBookingModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Processando...' : 'Confirmar reserva'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SpaceDetail;
