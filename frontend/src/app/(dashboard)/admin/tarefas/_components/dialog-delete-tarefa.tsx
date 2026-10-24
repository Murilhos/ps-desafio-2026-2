'use client'

import { destroyTarefa } from '@/actions/tarefa'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/dialog'
import { useToast } from '@/components/use-toast'
import { useState } from 'react'

interface DialogDeleteTarefaProps {
  id: string
  children: React.ReactNode
}

export function DialogTarefaDelete({ id, children }: DialogDeleteTarefaProps) {
  const [open, setOpen] = useState<boolean>()
  const { toast } = useToast()

  const submit = async () => {
    const { error } = await JSON.parse(await destroyTarefa(id))

    if (error) {
      toast({ title: 'Não foi possível excluir a tarefa!' })
    } else {
      toast({ title: 'Tarefa excluída com sucesso!' })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão de tarefa</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta tarefa? Esta ação é
            irreversível e removerá permanentemente a tarefa do sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" type="submit">
              Excluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}