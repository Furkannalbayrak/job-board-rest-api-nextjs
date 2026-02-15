// hooks/use-applications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface Application {
    id: string
    jobId: string
    userId: string
    createdAt: string
    job?: {
        id: string
        title: string
        company: string
        location: string
        description: string
        salary?: string | null
    }
    user?: {
        id: string
        email: string
        name: string
    }
}

// Tüm başvuruları getir
export function useApplications(userId?: string, jobId?: string) {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (jobId) params.append('jobId', jobId)
    
    return useQuery({
        queryKey: ['applications', userId, jobId],
        queryFn: async () => {
            const { data } = await axios.get<Application[]>(`/api/applications?${params.toString()}`);
            return data;
        },
    })
}

// Yeni başvuru oluştur
export function useCreateApplication() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newApplication: { userId: string; jobId: string }) => {
            const { data } = await axios.post<Application>('/api/applications', newApplication);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] })
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })
}

// Kullanıcının bir işe başvurup başvurmadığını kontrol et
export function useHasApplied(userId: string | undefined, jobId: string) {
    return useQuery({
        queryKey: ['hasApplied', userId, jobId],
        queryFn: async () => {
            if (!userId) return false;
            const { data } = await axios.get<Application[]>(`/api/applications?userId=${userId}&jobId=${jobId}`);
            return data.length > 0;
        },
        enabled: !!userId && !!jobId,
    })
}