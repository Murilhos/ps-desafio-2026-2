'use server'

import { api } from '@/services/api'
import { tarefaType } from '@/types/tarefa'
import { revalidatePath } from 'next/cache'

export async function getTarefas(projetoId?: string) {
  const url = projetoId ? `/tarefas?projeto_id=${projetoId}` : '/tarefas'
  const res = await api<tarefaType[]>('GET', url)
  return JSON.stringify(res)
}

export async function createTarefa(form: FormData) {
  const res = await api('POST', '/tarefas', { data: form })

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function updateTarefa(form: FormData) {
  const res = await api('PUT', `/tarefas/${form.get('id')}`, {
    data: form,
  })

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}

export async function destroyTarefa(id: string) {
  const res = await api('DELETE', `/tarefas/${id}`)

  if (!res.error) {
    revalidatePath('/admin/tarefas')
    revalidatePath('/admin/projetos')
  }

  return JSON.stringify(res)
}