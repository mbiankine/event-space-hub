
import { ReactNode } from 'react';
import { Control } from 'react-hook-form';
import { SpaceFormValues } from '../types';

export interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export interface AmenitiesSectionProps {
  control: Control<SpaceFormValues>;
  form: any;
}

