
import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { AccountLayout } from '@/components/account/AccountLayout';
import { Overview } from '@/components/account/Overview';
import { PersonalInfo } from '@/components/account/PersonalInfo';
import { Addresses } from '@/components/account/Addresses';
import { Orders } from '@/components/account/Orders';

export const Account = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AccountLayout>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="personal-info" element={<PersonalInfo />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="orders" element={<Orders />} />
      </Routes>
    </AccountLayout>
  );
};
