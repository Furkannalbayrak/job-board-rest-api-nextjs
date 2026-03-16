import { authOptions } from "@/lib/auth";
import { Briefcase, Users, LogIn, Building2 } from "lucide-react"
import { getServerSession } from "next-auth";
import Link from "next/link"
import UserAccountNav from "./UserAccountNav";

export async function Header() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo ve Ana Navigasyon */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Job Board</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                                <Briefcase className="w-4 h-4" />
                                İş İlanları
                            </Link>

                            {user?.role === "JOB_SEEKER" && (
                                <Link href="/applications" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Users className="w-4 h-4" />
                                    Başvurularım
                                </Link>
                            )}

                            {user?.role === "EMPLOYER" && (
                                <>
                                    <Link href="/my-jobs" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                        <Building2 className="w-4 h-4" />
                                        İlanlarım
                                    </Link>

                                    <div className="bg-white border-b border-gray-200 px-8 py-4">
                                        <div className="flex items-center justify-between">
                                            <Link href="/jobs/new" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                                + Yeni İlan Ekle
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Sağ Taraf: Admin ve Profil */}
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <div>
                                <UserAccountNav />
                            </div>
                        ) :
                            (
                                <div>
                                    <Link href={'/sign-in'}  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                                        <LogIn className="w-4 h-4" />
                                        Sign in
                                    </Link>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </header>
    )
}