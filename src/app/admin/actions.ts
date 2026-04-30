'use server'

import { createClient as createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Check if current user is admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admins only' }
  }

  // Use the admin client to bypass RLS and delete the auth.user
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'user') {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Check if current user is admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admins only' }
  }

  // Use the admin client to update the profile role
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('profiles').update({ role: newRole }).eq('id', userId)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}
