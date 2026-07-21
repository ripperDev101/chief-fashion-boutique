import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types/database';

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

type ProductWithCategory = Product & { category: Category };

const XS_SIZE = 'XS';

const addXsToSizes = (sizes: string[] = []) => {
  return Array.from(new Set([XS_SIZE, ...sizes]));
};

const PRODUCT_OVERRIDES: Record<string, Partial<Product>> = {
  '/IMG_2219.PNG': {
    name: 'Orange shweshwe Dress',
    price: 2000,
    colors: ['Orange'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    images: ['/shweshwe1.jpeg', '/shweshwe2.jpeg', '/shweshwe3.jpeg'],
    description: [
      'Pickup available at Chief Fashion House',
      '',
      '* Organic shweshwe material',
      '* Pockets',
      '* Zip at back with string',
      '* Under the knee',
      '* Doek included',
    ].join('\n'),
  },
  '/IMG_5616.JPG.jpeg': {
    name: 'Black Xhosa Corset Top & Skirt Set',
    price: 1600,
    colors: ['Black', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    images: ['/blackXhosa1.jpeg', '/blackXhosa2.jpeg', '/blackXhosa3.jpeg'],
    description: [
      'Pickup available at Chief Fashion House',
      '',
      'Black Xhosa corset top - R400',
      '* Black cotton twill fabric',
      '* White Xhosa binding',
      '* Side back holes with string',
      '',
      'Black Xhosa skirt - R1200',
      '* Black cotton twill fabric',
      '* High waisted',
      '* Pockets',
      '* Zip at side back',
      '* White Xhosa binding with black buttons',
      '* Maxi length',
    ].join('\n'),
  },
  '/IMG_2221.PNG': {
    name: 'Orange African print dress',
    price: 500,
    colors: ['Orange'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    images: ['/orangeAfrican1.PNG', '/orangeAfrican2.PNG', '/orangeAfrican3.PNG'],
    description: [
      '* African print materials',
      '* V neck',
      '* Short sleeve',
      '* Pockets',
      '* Zip at back',
      '* Under the knee',
      '* Doek included',
    ].join('\n'),
  },
};

const applyProductOverrides = <T extends Product>(product: T): T => {
  const imageKey = product.images?.[0];
  const overrides = imageKey ? PRODUCT_OVERRIDES[imageKey] : undefined;

  if (!overrides) {
    return {
      ...product,
      sizes: addXsToSizes(product.sizes),
    };
  }

  return {
    ...product,
    ...overrides,
    sizes: addXsToSizes(overrides.sizes ?? product.sizes),
  };
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*, category:categories(*)');

      if (filters?.category) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.inStock) {
        query = query.gt('stock', 0);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      let products = (data as ProductWithCategory[]).map(applyProductOverrides);

      if (filters?.sizes && filters.sizes.length > 0) {
        products = products.filter((p) => filters.sizes!.some((s) => p.sizes.includes(s)));
      }

      if (filters?.colors && filters.colors.length > 0) {
        products = products.filter((p) => filters.colors!.some((c) => p.colors.includes(c)));
      }

      return products;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return applyProductOverrides(data as ProductWithCategory);
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');

      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('featured', true)
        .limit(8);

      if (error) throw error;
      return (data as ProductWithCategory[]).map(applyProductOverrides);
    },
  });
};


