'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import FormFieldsTarefa from './form-fields-tarefa'
import { createTarefa } from '@/actions/tarefa'
import { filterFormData } from '@/services/filter-form-data'
import { useState } from 'react'
import { useToast } from '@/components/use-toast'
import { projetoType } from '@/types/projeto'

interface DialogCreateTarefaProps {
  projetos: projetoType[]
  children: React.ReactNode
}

export function DialogCreateTarefa({
  projetos,
  children,
}: DialogCreateTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(await createTarefa(newForm))

    if (error) {
      toast({
        title: error.message || 'Não foi possível criar a tarefa!',
      })
    } else {
      toast({ title: 'Tarefa criada com sucesso!' })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar tarefa</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova tarefa abaixo e clique em
            &rdquo;Salvar&rdquo; para incluí-la no sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <FormFieldsTarefa projetos={projetos} />
        </form>
      </DialogContent>
    </Dialog>
  )
}