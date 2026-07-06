-- Remove demo products and add new dress products

-- Ensure dresses category exists
INSERT INTO public.categories (name, slug) 
SELECT 'Dresses', 'dresses'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'dresses');

-- Get the category ID
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM public.categories WHERE slug = 'dresses';
  
  -- Delete all existing products
  DELETE FROM public.products;

  -- Insert new dress products
  INSERT INTO public.products (name, description, price, category_id, sizes, colors, images, stock, featured) VALUES
    ('Orange shweshwe Dress', 'Pickup available at Chief Fashion House\n\n* Organic shweshwe material\n* Pockets\n* Zip at back with chimgwe\n* Under the knee\n* Doek included', 2000.00, cat_id, ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'], ARRAY['Orange'], ARRAY['/shweshwe1.jpeg', '/shweshwe2.jpeg', '/shweshwe3.jpeg'], 20, true),
    ('Orange African print dress', '* African print materials\n* V neck\n* Short sleeve\n* Pockets\n* Zip at back\n* Under the knee\n* Doek included', 600.00, cat_id, ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'], ARRAY['Orange'], ARRAY['/orangeAfrican1.PNG', '/orangeAfrican2.PNG', '/orangeAfrican3.PNG'], 25, true),
    ('Black Xhosa Corset Top & Skirt Set', 'Pickup available at Chief Fashion House\n\nBlack Xhosa corset top - R400\n* Black cotton twill fabric\n* White Xhosa binding\n* Side back holes with string\n\nBlack Xhosa skirt - R1200\n* Black cotton twill fabric\n* High waisted\n* Pockets\n* Zip at side back\n* White Xhosa binding with black buttons\n* Maxi length', 1600.00, cat_id, ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'], ARRAY['Black', 'White'], ARRAY['/blackXhosa1.jpeg', '/blackXhosa2.jpeg', '/blackXhosa3.jpeg'], 30, true);
END $$;


