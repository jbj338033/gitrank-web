import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/entities/user';
import { useAuthStore } from '@/features/auth';

export function useSync() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async () => {
      await userApi.sync();
      return userApi.getMe();
    },
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['my', 'repos'] });
    },
  });
}

export function useUpdateVisibility() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (visible: boolean) => userApi.updateVisibility(visible),
    onSuccess: (_, visible) => {
      updateUser({ visible });
    },
  });
}

export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => userApi.deleteMe(),
    onSuccess: () => {
      logout();
    },
  });
}
