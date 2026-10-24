'use client'

import { getProjetoMembros } from '@/actions/projeto'
import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { membroType } from '@/types/member'
import { projetoType } from '@/types/projeto'
import { tarefaType } from '@/types/tarefa'
import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

interface FormFieldsTarefaProps {
  tarefa?: tarefaType
  projetos: projetoType[]
  readOnly?: boolean
}

export default function FormFieldsTarefa({
  tarefa,
  projetos,
  readOnly,
}: FormFieldsTarefaProps) {
  const { pending } = useFormStatus()
  const [selectedProjetoId, setSelectedProjetoId] = useState<string>(
    tarefa?.projeto_id ?? '',
  )
  const [selectedMembroId, setSelectedMembroId] = useState<string>(
    tarefa?.membro_id ?? '',
  )
  const [membrosProjeto, setMembrosProjeto] = useState<membroType[]>([])

  useEffect(() => {
    async function loadMembros() {
      if (!selectedProjetoId) {
        setMembrosProjeto([])
        setSelectedMembroId('')
        return
      }
      const { response } = await JSON.parse(
        await getProjetoMembros(selectedProjetoId),
      )
      const lista = response ?? []
      setMembrosProjeto(lista)

      // Mantém o membro selecionado apenas se ele pertencer ao projeto escolhido
      if (
        tarefa?.projeto_id === selectedProjetoId &&
        tarefa?.membro_id &&
        lista.some((m: membroType) => m.id === tarefa.membro_id)
      ) {
        setSelectedMembroId(tarefa.membro_id)
      } else {
        setSelectedMembroId('')
      }
    }
    loadMembros()
  }, [selectedProjetoId, tarefa?.projeto_id, tarefa?.membro_id])

  const defaultPrazo = tarefa?.prazo ? tarefa.prazo.split('T')[0] : undefined

  return (
    <>
      <FormFieldsGroup>
        {tarefa && (
          <Input defaultValue={tarefa.id} type="text" name="id" hidden />
        )}
        <FormField>
          <Label htmlFor="titulo">Título</Label>
          <Input
            name="titulo"
            id="titulo"
            placeholder="Insira o título da tarefa"
            defaultValue={tarefa?.titulo}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            name="descricao"
            id="descricao"
            placeholder="Insira a descrição da tarefa"
            defaultValue={tarefa?.descricao ?? ''}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="projeto_id">Projeto</Label>
          <select
            name="projeto_id"
            id="projeto_id"
            value={selectedProjetoId}
            onChange={(e) => setSelectedProjetoId(e.target.value)}
            disabled={pending || readOnly}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Selecione um projeto
            </option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="membro_id">Membro responsável (alocado no projeto)</Label>
          <select
            name="membro_id"
            id="membro_id"
            value={selectedMembroId}
            onChange={(e) => setSelectedMembroId(e.target.value)}
            disabled={pending || readOnly || !selectedProjetoId}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sem responsável atribuído</option>
            {membrosProjeto.map((membro) => (
              <option key={membro.id} value={membro.id}>
                {membro.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            id="status"
            defaultValue={tarefa?.status ?? 'pendente'}
            disabled={pending || readOnly}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
            <option value="atrasada">Atrasada</option>
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="prazo">Prazo</Label>
          <Input
            name="prazo"
            id="prazo"
            type="date"
            defaultValue={defaultPrazo}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
      </FormFieldsGroup>
      <DialogFooter className={cn({ hidden: readOnly })}>
        <Button type="submit" pending={pending}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  )
}