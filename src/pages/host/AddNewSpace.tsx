
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpaceForm } from '@/components/host/SpaceForm';
import { SpaceFormHeader } from '@/components/host/spaces/SpaceFormHeader';
import { useSpaceSubmission } from '@/components/host/spaces/useSpaceSubmission';

const AddNewSpace = () => {
  const { handleSubmit, isSubmitting } = useSpaceSubmission();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 md:px-6 lg:px-8 py-8">
        <SpaceFormHeader />
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <SpaceForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddNewSpace;
