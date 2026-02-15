import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface Job {
    id: string
    title: string
    company: string
    location: string
    description: string
    salary?: string | null
    createdAt: string
}

// Tüm işleri getir
export function useJobs() {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const { data } = await axios.get<Job[]>('/api/jobs');
            return data;
        },
    })
}

// Tek bir işi getir
export function useJob(id: string) {
    return useQuery({
        queryKey: ['jobs', id],
        queryFn: async () => {
            const { data } = await axios.get<Job>(`/api/jobs/${id}`);
            return data;
        },
        enabled: !!id,
    })
}

// Yeni iş oluştur
export function useCreateJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newJob: Omit<Job, 'id' | 'createdAt'>) => {
            const { data } = await axios.post<Job>('/api/jobs', newJob);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await axios.delete(`/api/jobs/${jobId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
