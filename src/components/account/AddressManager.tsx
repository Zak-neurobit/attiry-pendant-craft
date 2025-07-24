
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Simple address manager component that shows a placeholder for now
export const AddressManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
        <p className="text-muted-foreground">
          Manage your shipping addresses
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Address management coming soon</h3>
          <p className="text-muted-foreground text-center">
            The address management feature will be available once the database is properly configured.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
