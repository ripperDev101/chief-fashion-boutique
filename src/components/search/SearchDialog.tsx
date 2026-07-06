import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[] | null;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images')
        .ilike('name', `%${query}%`)
        .limit(6);
      
      setResults(data || []);
      setIsLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (productId: string) => {
    onOpenChange(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 top-[5%] translate-y-0 sm:top-[50%] sm:translate-y-[-50%] max-h-[90vh] mx-4 sm:mx-auto w-[calc(100%-2rem)] sm:w-full">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="border-0 focus-visible:ring-0 text-base"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          )}
          
          {!isLoading && query && results.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No products found</div>
          )}
          
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">R {product.price} ZAR</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
