'use server'

import { currentUser } from '@/lib/auth-util'
import { db } from '@/lib/db'

type DecreaseCreditResult =
  | { success: true; remainingCredits: number }
  | { success: false; error: string }

export async function decreaseUserCredits(): Promise<DecreaseCreditResult> {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      throw new Error('Unauthorized')
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        credit: {
          decrement: 1,
        },
      },
    })

    return {
      success: true,
      remainingCredits: updatedUser.credit,
    }
  } catch (error) {
    console.error('Error updating user credits:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}
