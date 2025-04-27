import { auth } from '@/auth'

/**
 * @returns current user details for using in server side code
 */
export const currentUser = async () => {
  const session = await auth()

  return session?.user
}
