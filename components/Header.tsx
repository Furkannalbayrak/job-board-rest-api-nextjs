import { authOptions } from "@/lib/auth";
import { Briefcase, Users, LogIn } from "lucide-react"
import { getServerSession } from "next-auth";
import Link from "next/link"
import UserAccountNav from "./UserAccountNav";

export async function Header() {
    const session = await getServerSession(authOptions);

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
                            <Link href="/applications" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                <Users className="w-4 h-4" />
                                Başvurular
                            </Link>
                        </nav>
                    </div>

                    {/* Sağ Taraf: Admin ve Profil */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Admin Panel
                        </Link>

                        {session?.user ? (
                            <div>
                                <UserAccountNav />
                            </div>
                        ) :
                            (
                                <div>
                                    <Link href={'/sign-in'} >
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