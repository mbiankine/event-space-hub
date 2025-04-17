
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';

interface CoHost {
  id: string;
  name: string;
  avatar_url?: string;
}

interface HostProfileCardProps {
  hostId: string;
  spaceTitle: string;
  hostName: string;
  hostAvatar?: string;
  rating: number;
  reviewCount: number;
  yearsHosting: number;
  responseRate: number;
  responseTime: string;
  coHosts?: CoHost[];
  onMessageClick: () => void;
}

export function HostProfileCard({
  hostId,
  spaceTitle,
  hostName,
  hostAvatar,
  rating,
  reviewCount,
  yearsHosting,
  responseRate,
  responseTime,
  coHosts = [],
  onMessageClick
}: HostProfileCardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Conheça seu anfitrião</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={hostAvatar} alt={hostName} />
                  <AvatarFallback>{hostName[0]}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{spaceTitle}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                  {hostName} é Superhost
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-semibold mb-1">{reviewCount}</div>
                    <div className="text-muted-foreground">avaliações</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-1 mb-1">
                      {rating.toFixed(2)}
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <div className="text-muted-foreground">estrelas</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{yearsHosting}</div>
                    <div className="text-muted-foreground">anos hospedando</div>
                  </div>
                </div>
              </div>
            </div>
            
            {coHosts.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Coanfitriões</h4>
                <div className="flex gap-4">
                  {coHosts.map((coHost) => (
                    <div key={coHost.id} className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={coHost.avatar_url} alt={coHost.name} />
                        <AvatarFallback>{coHost.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{coHost.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Informações do anfitrião</h4>
              <div className="space-y-2">
                <p className="text-sm">Taxa de resposta: {responseRate}%</p>
                <p className="text-sm">Responde em até {responseTime}</p>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              variant="default"
              onClick={onMessageClick}
            >
              Enviar mensagem ao anfitrião
            </Button>
            
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <div className="shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 5.33331V10.6666C14 13.3333 13 14.3333 10.3333 14.3333H5.66667C3 14.3333 2 13.3333 2 10.6666V5.33331C2 2.66665 3 1.66665 5.66667 1.66665H10.3333C13 1.66665 14 2.66665 14 5.33331Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.3333 6L8.24667 7.66667C7.56 8.21333 6.43333 8.21333 5.74667 7.66667L3.66667 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p>Para ajudar a proteger seu pagamento, sempre use o chat para enviar dinheiro e se comunicar com os anfitriões.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
