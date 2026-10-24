'use client'

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { Button } from '@/components/button'
import { Label } from '@/components/label'
import { useToast } from '@/components/use-toast'
import { filterFormData } from '@/services/filter-form-data'
import { allocateMembroProjeto, getProjetoMembros, removeMembroProjeto } from '@/actions/projeto'
import { api } from '@/services/api'
import { projetoType } from '@/types/projeto'
import { membroType } from '@/types/member'
import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { LuTrash } from 'react-icons/lu'

interface DialogAllocateMemberProps {
  projeto: projetoType
  children: React.ReactNode
}

function AllocateSubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" pending={pending} disabled={disabled}>
      Alocar
    </Button>
  )
}

export function DialogAllocateMember({
  projeto,
  children,
}: DialogAllocateMemberProps) {
  const [open, setOpen] = useState<boolean>()
  const [allocatedMembers, setAllocatedMembers] = useState<membroType[]>([])
  const [allMembers, setAllMembers] = useState<membroType[]>([])
  const { toast } = useToast()

  const loadData = async () => {
    // Busca simultaneamente os membros do sistema e os já alocados no projeto
    const [allocatedRes, allRes] = await Promise.all([
      JSON.parse(await getProjetoMembros(projeto.id)),
      api<membroType[]>('GET', '/membros'),
    ])

    if (allocatedRes.response) {
      setAllocatedMembers(allocatedRes.response)
    }
    if (allRes.response) {
      setAllMembers(allRes.response)
    }
  }

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, projeto.id])

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form)
    const { error } = await JSON.parse(
      await allocateMembroProjeto(projeto.id, newForm),
    )

    if (error) {
      toast({
        title: error.message || 'Não foi possível alocar o membro no projeto!',
      })
    } else {
      toast({ title: 'Membro alocado com sucesso!' })
      await loadData()
    }
  }

  const handleRemove = async (membroId: string) => {
    const { error } = await JSON.parse(
      await removeMembroProjeto(projeto.id, membroId),
    )

    if (error) {
      toast({
        title: error.message || 'Não foi possível remover o membro do projeto!',
      })
    } else {
      toast({ title: 'Membro removido com sucesso!' })
      await loadData()
    }
  }

  // Filtra apenas membros disponíveis para alocação
  const availableMembers = allMembers.filter(
    (member) => !allocatedMembers.some((allocated) => allocated.id === member.id),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alocação de membros — {projeto.nome}</DialogTitle>
          <DialogDescription>
            Selecione um membro abaixo e clique em &rdquo;Salvar&rdquo; para
            vinculá-lo ao projeto.
          </DialogDescription>
        </DialogHeader>

        <form action={submit}>
          <FormFieldsGroup>
            <FormField>
              <Label htmlFor="membro_id">Membro</Label>
              <div className="flex gap-2">
                <select
                  name="membro_id"
                  id="membro_id"
                  required
                  defaultValue=""
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    Selecione um membro
                  </option>
                  {availableMembers.map((membro) => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome} ({membro.email})
                    </option>
                  ))}
                </select>
                <AllocateSubmitButton disabled={availableMembers.length === 0} />
              </div>
            </FormField>
          </FormFieldsGroup>
        </form>

        <div className="space-y-2 pt-2">
          <Label>Membros alocados ({allocatedMembers.length})</Label>
          <div className="max-h-52 overflow-y-auto rounded-md border divide-y">
            {allocatedMembers.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground text-center">
                Nenhum membro alocado neste projeto.
              </p>
            ) : (
              allocatedMembers.map((membro) => (
                <div
                  key={membro.id}
                  className="flex items-center justify-between p-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{membro.nome}</p>
                    <p className="text-xs text-muted-foreground">{membro.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive-inverse"
                    size="icon"
                    onClick={() => handleRemove(membro.id)}
                  >
                    <LuTrash />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}