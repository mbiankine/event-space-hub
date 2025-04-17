
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  errorMessage: string;
  errorDetails: string;
}

export function ErrorDisplay({ errorMessage, errorDetails }: ErrorDisplayProps) {
  if (!errorMessage) return null;
  
  return (
    <div className="mb-6 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <h3 className="font-semibold text-red-600 dark:text-red-400">Erro ao salvar configurações</h3>
      </div>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      
      {errorDetails && (
        <div className="mt-2">
          <details className="text-xs">
            <summary className="cursor-pointer text-red-500 font-medium">Ver detalhes técnicos</summary>
            <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded overflow-auto max-h-60">
              {errorDetails}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
