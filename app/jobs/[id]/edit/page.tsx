"use client"

import { useJob } from "@/hooks/use-jobs"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useState, useEffect } from "react"
import axios from "axios"
import { useQueryClient } from "@tanstack/react-query"

export default function EditJobPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string
    const queryClient = useQueryClient()

    const { data: job, isLoading, error } = useJob(jobId)
    
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                salary: job.salary || ''
            })
        }
    }, [job])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await axios.put(`/api/jobs/${jobId}`, formData)
            
            // Cache'i invalidate et
            queryClient.invalidateQueries({ queryKey: ['jobs', jobId] })
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            
            router.push(`/jobs/${jobId}`)
        } catch (error) {
            console.error('Güncelleme hatası:', error)
            alert('İlan güncellenirken bir hata oluştu')
        } finally {
            setIsSaving(false)
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
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push(`/jobs/${jobId}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">İlan Düzenle</h2>
                            <p className="text-sm text-gray-500 mt-1">#{job.id.slice(0, 8)}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className="space-y-6">
                            {/* İş Pozisyonu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    İş Pozisyonu *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    placeholder="Örn: Frontend Developer"
                                />
                            </div>

                            {/* Şirket Adı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Şirket Adı *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    placeholder="Örn: Tech Company"
                                />
                            </div>

                            {/* Lokasyon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Lokasyon *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    placeholder="Örn: İstanbul, Türkiye"
                                />
                            </div>

                            {/* Maaş */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Maaş Aralığı
                                </label>
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    placeholder="Örn: 50.000 - 70.000 TL"
                                />
                            </div>

                            {/* Açıklama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    İş Açıklaması *
                                </label>
                                <textarea
                                    required
                                    rows={8}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                                    placeholder="İş tanımı, gereksinimler, beklentiler..."
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push(`/jobs/${jobId}`)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}