"use client"
/*
import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { projetoType } from '@/types/projeto'
import { useFormStatus } from 'react-dom'

interface FormFieldsProjetoProps {
  projeto?: projetoType
  readOnly?: boolean
}

export default function FormFieldsProjeto({
  projeto,
  readOnly,
}: FormFieldsProjetoProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <FormFieldsGroup>
        {projeto && <Input defaultValue={projeto.id} type="text" name="id" hidden />}
        <FormField>
          <Label htmlFor="nome">Nome</Label>
          <Input
            name="nome"
            id="nome"
            placeholder="Insira o nome"
            defaultValue={projeto?.nome}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="nome_cliente">Nome do cliente</Label>
          <Input
            name="nome_cliente"
            id="nome_cliente"
            placeholder="Insira o nome do cliente"
            defaultValue={projeto?.nome_cliente}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            name="descricao"
            id="descricao"
            placeholder="Insira a descrição do projeto"
            defaultValue={projeto?.descricao}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_inicio">Data de início</Label>
          <Input
            name="data_inicio"
            id="data_inicio"
            type="date"
            defaultValue={projeto?.data_inicio}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_fim">Data de fim</Label>
          <Input
            name="data_fim"
            id="data_fim"
            type="date"
            defaultValue={projeto?.data_fim}
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
*/

import { Button } from '@/components/button'
import { FormFieldsGroup, FormField } from '@/components/dashboard/form'
import { DialogFooter } from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'
import { projetoType } from '@/types/projeto'
import { useFormStatus } from 'react-dom'

interface FormFieldsProjetoProps {
  projeto?: projetoType
  readOnly?: boolean
}

export default function FormFieldsProjeto({
  projeto,
  readOnly,
}: FormFieldsProjetoProps) {
  const { pending } = useFormStatus()

  const defaultDataInicio = projeto?.data_inicio
    ? projeto.data_inicio.split('T')[0]
    : undefined
  const defaultDataFim = projeto?.data_fim
    ? projeto.data_fim.split('T')[0]
    : undefined

  return (
    <>
      <FormFieldsGroup>
        {projeto && <Input defaultValue={projeto.id} type="text" name="id" hidden />}
        <FormField>
          <Label htmlFor="nome">Nome</Label>
          <Input
            name="nome"
            id="nome"
            placeholder="Insira o nome"
            defaultValue={projeto?.nome}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="nome_cliente">Nome do cliente</Label>
          <Input
            name="nome_cliente"
            id="nome_cliente"
            placeholder="Insira o nome do cliente"
            defaultValue={projeto?.nome_cliente}
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
            placeholder="Insira a descrição do projeto"
            defaultValue={projeto?.descricao}
            disabled={pending}
            readOnly={readOnly}
          />
        </FormField>
        <FormField>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            id="status"
            defaultValue={projeto?.status ?? 'ativo'}
            disabled={pending || readOnly}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="planejamento">Planejamento</option>
            <option value="ativo">Ativo</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </FormField>
        <FormField>
          <Label htmlFor="data_inicio">Data de início</Label>
          <Input
            name="data_inicio"
            id="data_inicio"
            type="date"
            defaultValue={defaultDataInicio}
            disabled={pending}
            readOnly={readOnly}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="data_fim">Data de fim</Label>
          <Input
            name="data_fim"
            id="data_fim"
            type="date"
            defaultValue={defaultDataFim}
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