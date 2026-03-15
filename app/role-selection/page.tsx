'use client'
import axios from 'axios';
import { Briefcase, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react';
import { toast } from 'sonner';

const page = () => {
    const serachParams = useSearchParams();
    const email = serachParams.get('email');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleSelection = async (role: string) => {
        if (!email) {
            toast.error("Email bulunamadı");
            return;
        }
        setIsLoading(true);

        try {
            if (role === 'EMPLOYER') {
                const response = await axios.patch('/api/users', {
                    email: email,
                    role: role
                });

                if (response.status !== 200) {
                    throw new Error("Güncelleme başarısız");
                }
            }

            toast.success("Hesabınız oluşturuldu! Giriş yapabilirsiniz.");
            router.push("/sign-in");

        } catch (error) {
            console.log(error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="text-center mb-10 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hesabını Oluşturalım</h1>
                <p className="text-gray-500">Devam etmek için sizi en iyi tanımlayan profili seçin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                {/* İŞ ARAYAN KARTI */}
                <button
                    onClick={() => handleRoleSelection('JOB_SEEKER')}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center justify-center p-10 h-80 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="bg-blue-50 p-6 rounded-full group-hover:bg-blue-100 transition-colors mb-6">
                        <Search className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">İş Arıyorum</h3>
                    <p className="text-center text-gray-500 max-w-xs">
                        Hayalimdeki işi bulmak, kariyerimi geliştirmek ve fırsatları keşfetmek istiyorum.
                    </p>
                </button>

                {/* İŞ VEREN KARTI */}
                <button
                    onClick={() => handleRoleSelection('EMPLOYER')}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center justify-center p-10 h-80 bg-white border-2 border-gray-200 rounded-2xl hover:border-violet-500 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="bg-violet-50 p-6 rounded-full group-hover:bg-violet-100 transition-colors mb-6">
                        <Briefcase className="w-12 h-12 text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">İş Verenim</h3>
                    <p className="text-center text-gray-500 max-w-xs">
                        Yetenekli adayları keşfetmek, ekibimi büyütmek ve ilan yayınlamak istiyorum.
                    </p>
                </button>
            </div>

            {isLoading && (
                <p className="mt-8 text-sm text-gray-400">Lütfen bekleyin, yönlendiriliyorsunuz...</p>
            )}
        </div>
    )
}

export default page