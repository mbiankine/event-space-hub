
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendMessageForm } from '@/components/client/SendMessageForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AuthDialog } from '@/components/space/AuthDialog';

interface InquiryFormProps {
  hostId: string;
  spaceId: string;
  spaceTitle: string;
}

export const InquiryForm = ({ hostId, spaceId, spaceTitle }: InquiryFormProps) => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  
  const handleInquiryClick = () => {
    if (!user) {
      setShowAuthDialog(true);
    }
  };
  
  const handleLogin = () => {
    // Redirect to login page with return URL
    window.location.href = `/auth/login?redirect=/spaces/${spaceId}`;
  };
  
  const handleRegister = () => {
    // Redirect to register page with return URL
    window.location.href = `/auth/register?redirect=/spaces/${spaceId}`;
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Enviar mensagem ao anfitrião</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <SendMessageForm 
              receiverId={hostId}
              spaceId={spaceId}
              placeholder={`Olá, tenho interesse no espaço "${spaceTitle}". Gostaria de obter mais informações...`}
            />
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">Faça login para enviar uma mensagem ao anfitrião</p>
              <Button onClick={handleInquiryClick}>Enviar mensagem</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AuthDialog 
        isOpen={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
};
