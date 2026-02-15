import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppliedJob {
    jobId: string
    appliedAt: string
}

interface ApplicationStore {
    appliedJobs: AppliedJob[]
    addApplication: (jobId: string) => void
    removeApplication: (jobId: string) => void
    hasApplied: (jobId: string) => boolean,
    getAppliedJobIds: () => string[]
    clearAll: () => void
}

export const useApplicationStore = create<ApplicationStore>()(
    persist(
        (set, get) => ({
            appliedJobs: [],

            addApplication: (jobId) => {
                const exists = get().appliedJobs.find(job => job.jobId === jobId)
                if (!exists) {
                    set((state) => ({
                        appliedJobs: [...state.appliedJobs, { jobId, appliedAt: new Date().toISOString() }]
                    }))
                }
            },

            removeApplication: (jobId) => {
                set((state) => ({
                    appliedJobs: state.appliedJobs.filter(job => job.jobId !== jobId)
                }))
            },

            hasApplied: (jobId) => {
                return get().appliedJobs.some(job => job.jobId === jobId)
            },

            getAppliedJobIds: () => {
                return get().appliedJobs.map(job => job.jobId)
            },

            clearAll: () => {
                set({ appliedJobs: [] })
            }
        }),
        {
            name: 'job-applications',
        }
    )
)