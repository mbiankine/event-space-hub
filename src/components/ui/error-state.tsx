
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Ocorreu um erro",
  description = "Não foi possível carregar os dados. Por favor, tente novamente.",
  actionLabel = "Tentar novamente",
  onAction = () => window.location.reload(),
  className,
}: ErrorStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          {description}
        </p>
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}
