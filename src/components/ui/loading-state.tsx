
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = "Carregando...",
  description = "Por favor, aguarde enquanto carregamos os dados.",
  className,
}: LoadingStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
