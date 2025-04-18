
import { Button } from "@/components/ui/button";

interface SpaceFormActionsProps {
  isSubmitting: boolean;
  isEnabled: boolean;
}

export function SpaceFormActions({ isSubmitting, isEnabled }: SpaceFormActionsProps) {
  return (
    <Button 
      type="submit" 
      disabled={!isEnabled}
      className="w-full"
    >
      {isSubmitting ? "Salvando..." : "Publicar Espaço"}
    </Button>
  );
}
