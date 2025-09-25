import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"

export const getServerAuthSession = () => {
  return getServerSession(authOptions)
}

export const currentUser = async () => {
  const session = await getServerAuthSession()
  return session?.user
}