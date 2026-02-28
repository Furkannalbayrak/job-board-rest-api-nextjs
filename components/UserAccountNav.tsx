'use client'
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

const UserAccountNav = () => {
    return (
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
        })}
            variant={"destructive"}>
            <LogOut className="w-4 h-4" />
            Sign Out
        </Button>
    )

}
export default UserAccountNav