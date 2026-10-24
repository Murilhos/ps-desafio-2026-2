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
import { tarefaType } from '@/types/tarefa'
import { projetoType } from '@/types/projeto'
import { useState } from 'react'

interface DialogInformationTarefaProps {
  tarefa: tarefaType
  projetos: projetoType[]
  children: React.ReactNode
}

export function DialogInformationTarefa({
  tarefa,
  projetos,
  children,
}: DialogInformationTarefaProps) {
  const [open, setOpen] = useState<boolean>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações da tarefa</DialogTitle>
          <DialogDescription>
            Visualize as informações detalhadas da tarefa abaixo.
          </DialogDescription>
        </DialogHeader>
        <FormFieldsTarefa tarefa={tarefa} projetos={projetos} readOnly />
      </DialogContent>
    </Dialog>
  )
}