import { Briefcase, Users, FileText, Settings, LogOut } from "lucide-react"

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Job Board</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    <li>
                        <a href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                            İş İlanları
                        </a>
                    </li>
                    <li>
                        <a href="/applications" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Users className="w-5 h-5" />
                            Başvurular
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}