
import { auth } from "@/lib/auth"

export default async function Home(){
  const data = await auth()
  return <div>Home</div>
}