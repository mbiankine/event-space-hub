
import { AlertCircle } from 'lucide-react';
import { FieldErrors } from 'react-hook-form';
import { SpaceFormValues } from './types';

interface FormValidationMessageProps {
  errors: FieldErrors<SpaceFormValues>;
}

export function FormValidationMessage({ errors }: FormValidationMessageProps) {
  // Count actual errors (excluding nested objects)
  const errorCount = Object.keys(errors).filter(key => {
    // Don't count parent objects that have nested errors
    if (typeof errors[key] === 'object' && errors[key]?.type !== 'manual') {
      return false;
    }
    return true;
  }).length;

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
