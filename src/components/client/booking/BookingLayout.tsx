
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface BookingLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const BookingLayout = ({ children, onRefresh, isRefreshing }: BookingLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/client/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-6">Detalhes da Reserva</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BookingLayout;
