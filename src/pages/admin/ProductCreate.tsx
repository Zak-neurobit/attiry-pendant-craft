
import React from 'react';
import { ProductForm } from '@/pages/admin/products/ProductForm';

const ProductCreate = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <ProductForm />
    </div>
  );
};

export default ProductCreate;
