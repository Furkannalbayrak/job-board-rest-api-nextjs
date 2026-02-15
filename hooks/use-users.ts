// hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
    id: string
    email: string
    name: string
    createdAt: string
}

// Tüm kullanıcıları getir
export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axios.get<User[]>('/api/users');
            return data;
        },
    })
}

// Tek kullanıcı getir
export function useUser(id: string) {
    return useQuery({
        queryKey: ['users', id],
        queryFn: async () => {
            const { data } = await axios.get<User>(`/api/users/${id}`);
            return data;
        },
        enabled: !!id,
    })
}

// Yeni kullanıcı oluştur (kayıt işlemi için)
export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newUser: { email: string; name: string }) => {
            const { data } = await axios.post<User>('/api/users', newUser);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}