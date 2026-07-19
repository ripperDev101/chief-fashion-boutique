import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/** True when the signed-in user has the admin role. */
export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user!.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
  });
};
