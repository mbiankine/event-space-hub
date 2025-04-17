
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

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
            Para reservar um espaço é necessário ter uma conta. Por favor, entre com sua conta ou crie uma nova.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button className="w-full" onClick={onLogin}>
            Entrar com minha conta
          </Button>
          <Button variant="outline" className="w-full" onClick={onRegister}>
            Criar uma nova conta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
