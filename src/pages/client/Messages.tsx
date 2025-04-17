import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MessagesThread } from '@/components/client/MessagesThread';

const ClientMessages = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get('space_id');
  const bookingId = searchParams.get('booking_id');
  
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!contactId || !user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch host information from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', contactId)
          .single();
          
        if (error) throw error;
        
        setContactInfo(data);
        
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactInfo();
  }, [contactId, user]);
  
  // If we have a booking ID, also fetch the booking details to show context
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [spaceDetails, setSpaceDetails] = useState<any>(null);
  
  useEffect(() => {
    const fetchContextDetails = async () => {
      if (!user) return;
      
      try {
        // If we have a booking ID, fetch booking details
        if (bookingId) {
          const { data: bookingData } = await supabase
            .from('bookings')
            .select('id, booking_date, space_title, total_price, payment_status')
            .eq('id', bookingId)
            .eq('client_id', user.id)
            .single();
            
          if (bookingData) {
            setBookingDetails(bookingData);
          }
        }
        
        // If we have a space ID, fetch space details
        if (spaceId) {
          const { data: spaceData } = await supabase
            .from('spaces')
            .select('id, title, images, location')
            .eq('id', spaceId)
            .single();
            
          if (spaceData) {
            setSpaceDetails(spaceData);
          }
        }
      } catch (error) {
        console.error('Error fetching context details:', error);
      }
    };
    
    fetchContextDetails();
  }, [bookingId, spaceId, user]);
  
  // Function to get image URL for space
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop";
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise get from storage
    const { data } = supabase.storage.from('spaces').getPublicUrl(imagePath);
    return data.publicUrl;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-6">
          <Link to="/client/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Mensagens</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium">{contactInfo?.full_name || 'Anfitrião'}</h3>
                    {contactInfo?.username && (
                      <p className="text-muted-foreground">{contactInfo.username}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {spaceDetails && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Espaço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spaceDetails.images && spaceDetails.images.length > 0 && (
                      <img 
                        src={getImageUrl(spaceDetails.images[0])}
                        alt={spaceDetails.title}
                        className="w-full h-40 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop";
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{spaceDetails.title}</h3>
                      {spaceDetails.location && (
                        <p className="text-muted-foreground">
                          {spaceDetails.location.city}, {spaceDetails.location.state}
                        </p>
                      )}
                    </div>
                    {bookingId ? (
                      <Button variant="outline" asChild className="w-full">
                        <Link to={`/client/bookings/${bookingId}`}>Ver Reserva</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild className="w-full">
                        <Link to={`/spaces/${spaceDetails.id}`}>Ver Espaço</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {bookingDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Reserva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span>{new Date(bookingDetails.booking_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Espaço:</span>
                      <span>{bookingDetails.space_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span>
                        {bookingDetails.total_price 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bookingDetails.total_price)
                          : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`${
                        bookingDetails.payment_status === 'paid' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {bookingDetails.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            {contactId && (
              <MessagesThread 
                contactId={contactId}
                spaceId={spaceId || undefined}
                bookingId={bookingId || undefined}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientMessages;
