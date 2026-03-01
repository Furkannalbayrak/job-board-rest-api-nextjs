import User from "@/components/User";
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session?.user ? (
        <h2>Admin Page - welcome back {session.user.username || session.user.name}</h2>
      ) : (
        <div>Please login to see this admin page</div>
      )}

      {/* Client session çok daha yavaş çalışıyor 
      Server session ise çok çok hızlı */}

      <h2>Client Session</h2>
      <User />

      <h2>Server Session</h2>
      {JSON.stringify(session)}

    </div>
  )
}

export default page