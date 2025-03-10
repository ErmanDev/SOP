import { Q_KEYS } from '@/shared/qkeys';
import { useQuery } from '@tanstack/react-query';
import { getAllUser } from '../services/user.service';

const useReadUsers = () => {
  return useQuery({
    queryFn: async () => {
      const response = await getAllUser();
      return response?.data || []; // ✅ Extracts the array from `data`
    },
    queryKey: [Q_KEYS.USERS],
    refetchOnWindowFocus: false,
  });
};

export default useReadUsers;
