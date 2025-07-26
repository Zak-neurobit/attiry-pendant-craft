import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetail from '@/pages/ProductDetail';

// Mock the product data
const mockProduct = {
  id: '1',
  slug: 'classic-script-name-pendant',
  title: 'Classic Script Name Pendant',
  price: 55,
  compare_price: 74,
  description: 'An elegant pendant.',
  image_urls: ['/path/to/image.jpg'],
  rating: 5,
  review_count: 150,
  color_variants: ['gold', 'silver'],
  category: 'featured',
  is_active: true,
  is_new: false,
  stock: 100,
  cogs: 12,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fonts: [],
  chain_types: [],
  keywords: [],
  meta_title: '',
  meta_description: '',
  tags: [],
};

// Mock the hooks and services the component depends on
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ slug: mockProduct.slug }),
    };
});

vi.mock('@/hooks/useSupabaseProducts', () => ({
  default: () => ({ product: mockProduct, isLoading: false, error: null }),
}));

vi.mock('@/hooks/usePrice', () => ({
    usePrice: (price) => ({ formattedPrice: `${price}.00`, isLoading: false }),
    useComparePrice: (price) => ({ formattedPrice: `${price}.00`, isLoading: false }),
}));

describe('ProductDetail Page', () => {
  it('should render product details correctly', async () => {
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    // Check for product name, price, and Add to Cart button
    expect(await screen.findByText(mockProduct.title)).toBeInTheDocument();
    expect(await screen.findByText(/\$55.00/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
  });
});
