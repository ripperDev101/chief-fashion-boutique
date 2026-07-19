-- Convert literal backslash-n sequences in product descriptions to real newlines
UPDATE public.products
SET description = replace(description, '\n', chr(10))
WHERE description LIKE '%\n%';
