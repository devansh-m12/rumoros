import { auth } from "@/lib/auth"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { signIn, signOut } from "@/lib/auth"
import Link from "next/link"

const Header = async () => {
  const session = await auth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold">
          Your Logo
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {session.user.name || session.user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <DropdownMenuItem asChild>
                    <button className="w-full text-left">
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <form
              action={async () => {
                "use server"
                await signIn()
              }}
            >
              <Button type="submit">Sign In</Button>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
