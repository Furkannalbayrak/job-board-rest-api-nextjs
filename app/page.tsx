"use client"

import { useJobs } from "@/hooks/use-jobs"
import { useRouter } from "next/navigation"
import { Briefcase, MapPin, DollarSign, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  const router = useRouter()
  const { data: jobs, isLoading, error } = useJobs()

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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">İş İlanları</h2>
              <p className="text-sm text-gray-500 mt-1">
                Toplam {jobs?.length || 0} ilan
              </p>
            </div>
            <button
              onClick={() => router.push('/jobs/new')}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              + Yeni İlan Ekle
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!jobs || jobs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz iş ilanı yok
              </h3>
              <p className="text-gray-500 mb-6">
                Yeni bir ilan ekleyerek başlayın
              </p>
              <button
                onClick={() => router.push('/jobs/new')}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                İlk İlanı Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{job.company}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                      Aktif
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(job.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}