
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickMenu } from "@/components/host/QuickMenu";

interface HostLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const HostLayout = ({ children, title, description }: HostLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6 text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <QuickMenu />
          <div className="col-span-1 lg:col-span-3">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
