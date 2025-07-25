
import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductForm } from '@/pages/admin/products/ProductForm';

const ProductEdit = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm productId={productId} />
    </div>
  );
};

export default ProductEdit;
