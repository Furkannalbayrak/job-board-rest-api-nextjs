"use client"

import { useJob, useDeleteJob } from "@/hooks/use-jobs"
import { useCreateApplication } from "@/hooks/use-applications"
import { useParams, useRouter } from "next/navigation"
import { MapPin, DollarSign, Calendar, Building2, ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string

    const { data: job, isLoading, error } = useJob(jobId)
    const deleteJobMutation = useDeleteJob()
    const createApplicationMutation = useCreateApplication()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Geçici olarak sabit user ID (gerçek uygulamada auth'dan gelecek)
    const currentUserId = "user-1" // Bu normalde auth sisteminden gelecek

    const handleDelete = async () => {
        try {
            await deleteJobMutation.mutateAsync(jobId)
            router.push('/')
        } catch (error) {
            console.error('Silme hatası:', error)
        }
    }

    const handleApply = async () => {
        try {
            await createApplicationMutation.mutateAsync({
                userId: currentUserId,
                jobId: jobId
            })
            alert('Başvurunuz alındı!')
        } catch (error: any) {
            if (error.response?.status === 409) {
                alert('Bu ilana zaten başvurdunuz!')
            } else {
                alert('Başvuru sırasında bir hata oluştu')
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Yükleniyor...</span>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
                        <p className="text-gray-900 font-medium">İlan bulunamadı</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                        >
                            Geri Dön
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Top Bar */}
                    <div className="bg-white border-b border-gray-200 px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.push('/')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">İlan Detayı</h2>
                                <p className="text-sm text-gray-500 mt-1">#{job.id.slice(0, 8)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => router.push(`/jobs/${job.id}/edit`)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Düzenle
                                </button>
                                <button 
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 max-w-4xl mx-auto">
                        {/* Main Card */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="w-5 h-5" />
                                            <span className="text-lg font-medium">{job.company}</span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                        Aktif
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-2 font-medium">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{job.salary}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(job.createdAt).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="px-8 py-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">İş Açıklaması</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <button 
                                onClick={handleApply}
                                disabled={createApplicationMutation.isPending}
                                className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {createApplicationMutation.isPending ? 'Başvuruluyor...' : 'Başvur'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div 
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">İlanı Sil</h3>
                        <p className="text-gray-600 mb-6">
                            Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteJobMutation.isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleteJobMutation.isPending ? 'Siliniyor...' : 'Sil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}