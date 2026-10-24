'use server'

import { api } from '@/services/api'
import { revalidatePath } from 'next/cache'

export async function createMember(form: FormData) {
  const res = await api('POST', '/membros', { data: form })

  if (!res.error) {
    revalidatePath('/admin/membros')
  }

  return JSON.stringify(res)
}

export async function updateMember(form: FormData) {
  const res = await api('POST', `/membros/${form.get('id')}`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/membros')
  }

  return JSON.stringify(res)
}

export async function destroyMember(id: string) {
  const res = await api('DELETE', `/membros/${id}`)

  if (!res.error) {
    revalidatePath('/admin/membros')
  }

  return JSON.stringify(res)
}
