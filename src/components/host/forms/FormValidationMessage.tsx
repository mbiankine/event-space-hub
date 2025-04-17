
import { AlertCircle } from 'lucide-react';

interface FormValidationMessageProps {
  errorCount: number;
}

export function FormValidationMessage({ errorCount }: FormValidationMessageProps) {
  if (errorCount === 0) return null;

  return (
    <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">Verifique os campos obrigatórios</p>
        <p className="text-sm">
          Há {errorCount} {errorCount === 1 ? 'campo que precisa' : 'campos que precisam'} ser preenchido{errorCount === 1 ? '' : 's'} corretamente.
        </p>
      </div>
    </div>
  );
}
