
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function AuthDialog({ isOpen, onOpenChange, onLogin, onRegister }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Faça login para continuar</DialogTitle>
          <DialogDescription>
            Para reservar um espaço é necessário ter uma conta. Por favor, escolha uma opção abaixo:
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2 text-center mb-2">
            <p className="text-sm text-gray-500">Você já tem uma conta?</p>
          </div>
          <Button className="w-full" onClick={onLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            Entrar com minha conta
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          <div className="space-y-2 text-center mb-2">
            <p className="text-sm text-gray-500">Crie uma conta para continuar</p>
          </div>
          <Button variant="outline" className="w-full" onClick={onRegister}>
            <UserPlus className="mr-2 h-4 w-4" />
            Criar uma nova conta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
