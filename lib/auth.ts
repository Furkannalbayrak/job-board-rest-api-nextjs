import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    //Bu satırla ona şunu diyorsun: "Google ile biri girdiğinde git onu benim Prisma ile bağladığım Supabase'e kaydet.
    //Adapter olmazsa kullanıcı giriş yapar ama veritabanında bir izi kalmaz.
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,

    //İki tip oturum yönetimi vardır: Database ve JWT. Sen JWT (JSON Web Token) seçerek şunu dedin: "Oturum bilgilerini veritabanında saklama, şifrelenmiş bir token (jeton) olarak kullanıcının tarayıcısına (cookie) ver." Bu daha hızlıdır ve veritabanı sorgu yükünü azaltır.
    session: {
        strategy: 'jwt'
    },

    //NextAuth'un kendi çirkin giriş sayfasını değil, senin yazdığın şık /sign-in sayfasını kullanmasını sağlar.
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        // Google'a gider, kullanıcının adını, e-postasını ve profil fotoğrafını alır. Eğer PrismaAdapter varsa, bu bilgileri otomatik olarak User tablosuna kaydeder.
        // Buradaki ünlemin amacı: TypeScript'e şunu der: "Bu değişkenin boş olmayacağına yemin ederim, hata verme".
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        CredentialsProvider({
            name: "Credentials",

            // zaten buradaki email ve password verileri form içindeki SignInForm.tsx den geliyor ancak
            // NextAuth'a "Benim bu provider'ım e-posta ve şifre bekliyor" diye önceden haber vermiş oluyorsun.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "sample@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Belli başlı kontroller
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });
                if (!existingUser) {
                    return null;
                }

                if (existingUser.password) {
                    const passwordMatch = await compare(credentials.password, existingUser.password);

                    if (!passwordMatch) {
                        return null;
                    }
                }

                //Eğer her şey doğruysa bir user objesi döner. Bu obje artık NextAuth'un elindedir ve bir sonraki adım olan Callbacks kısmına iletilir.
                return {
                    id: existingUser.id,
                    username: existingUser.username,
                    email: existingUser.email,
                }
            }
        })
    ],
    callbacks: {
        //Kullanıcı başarıyla giriş yaptığında ilk burası çalışır.
        //user parametresi sadece giriş anında doludur.
        // Sen burada diyorsun ki: "Eğer bu bir giriş anıysa, veritabanından gelen username bilgisini al ve NextAuth'un oluşturduğu Token'ın (jetonun) içine koy."
        //Artık elimizde içinde username yazan şifreli bir JWT var.
        async jwt({ token, user }) {

            //jwt callback fonksiyonu her sayfa yenilendiğinde veya oturum kontrol edildiğinde çalışır.
            //Ancak içindeki user parametresi sadece giriş yapıldığı an (Sign-in) doludur. Giriş yaptıktan sonraki tıklamalarında user artık undefined olur.
            //Yani: if (user) kontrolü "Şu an tam olarak giriş mi yapılıyor?" diye sorar. Eğer cevap evet ise, veritabanından gelen o user.username bilgisini alıp token'ın içine bir kez "mühürler".
            if (user) {
                return {
                    ...token,                   // Token içindeki mevcut her şeyi kopyala (id, email vs.)
                    username: user.username,    // Üzerine bir de username'i ekle (artık jetonumuzda bu da var!)
                }
            }

            // Eğer giriş anı değilse, zaten jeton daha önce oluşturulmuştur, 
            // hiçbir şeyi değiştirmeden mevcut token'ı geri döndür.
            return token
        },

        //Frontend tarafında useSession() dediğinde veya sunucuda oturuma baktığında burası çalışır.
        // Sen burada diyorsun ki: "JWT token'ın içinde sakladığımız o username bilgisini al ve kullanıcıya görünecek olan session objesine ekle."
        async session({ session, token }) {
            return {
                ...session,
                user: {     // User objesini güncellemeye başla:
                    ...session.user,  //İçinde oturumun ne zaman biteceği (expires) gibi bilgiler vardır. Bunları kaybetmemek için masaya döküyoruz.
                    username: token.username  //Sadece user: { username: token.username } yazarsan, kullanıcının email ve image gibi diğer bilgilerini silmiş olursun. Bu yüzden önce mevcut session.user bilgilerini yayıyoruz,
                }
            }
        }

        /*
        username: user.username diyerek bilgiyi token (token) içine kaydetmiştik.
        İşte bu session fonksiyonu parametre olarak o token'ı alır. Sen de diyorsun ki: "Hey NextAuth, o jetonun içine sakladığım username'i al ve kullanıcıya göndereceğin session objesinin içine koy."
        */
    }
}
