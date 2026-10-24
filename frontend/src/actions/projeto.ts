'use server'

import { api } from '@/services/api'
import { membroType } from '@/types/member'
import { revalidatePath } from 'next/cache'

export async function createProjeto(form: FormData) {
  const res = await api('POST', '/projetos', { data: form })

  if (!res.error) {
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function updateProjeto(form: FormData) {
  const res = await api('PUT', `/projetos/${form.get('id')}`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function destroyProjeto(id: string) {
  const res = await api('DELETE', `/projetos/${id}`)

  if (!res.error) {
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

// Funções para alocação de membros no projeto

export async function getProjetoMembros(projetoId: string) {
  const res = await api<membroType[]>('GET', `/projetos/${projetoId}/membros`)

  return JSON.stringify(res)
}

export async function allocateMembroProjeto(projetoId: string, form: FormData) {
  const res = await api('POST', `/projetos/${projetoId}/membros`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function removeMembroProjeto(projetoId: string, membroId: string) {
  const res = await api('DELETE', `/projetos/${projetoId}/membros/${membroId}`)

  if (!res.error) {
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}
