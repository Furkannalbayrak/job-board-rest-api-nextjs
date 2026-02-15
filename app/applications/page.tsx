"use client"

import { useApplications } from "@/hooks/use-applications"
import { useRouter } from "next/navigation"
import { Briefcase, MapPin, Calendar, Building2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function ApplicationsPage() {
    const router = useRouter()
    
    // Geçici olarak sabit user ID (gerçek uygulamada auth'dan gelecek)
    const currentUserId = "user-1"
    
    const { data: applications, isLoading, error } = useApplications(currentUserId)

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

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
                        <p className="text-gray-900 font-medium">Hata oluştu</p>
                        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
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
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Başvurularım</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Toplam {applications?.length || 0} başvuru
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!applications || applications.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Henüz başvurunuz yok
                            </h3>
                            <p className="text-gray-500 mb-6">
                                İlanlara göz atarak kariyer yolculuğunuza başlayın
                            </p>
                            <button 
                                onClick={() => router.push('/')}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                İlanları Görüntüle
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((application) => (
                                <div
                                    key={application.id}
                                    onClick={() => router.push(`/jobs/${application.jobId}`)}
                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                {/* Company Logo */}
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {application.job?.company.charAt(0) || 'J'}
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {application.job?.title || 'İlan Bulunamadı'}
                                                    </h3>
                                                    <p className="text-gray-600 mb-3">
                                                        {application.job?.company || '-'}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        {application.job?.location && (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{application.job.location}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                Başvuru: {new Date(application.createdAt).toLocaleDateString('tr-TR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full ml-4">
                                            Başvuruldu
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}