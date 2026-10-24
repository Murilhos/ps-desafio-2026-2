import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { Button } from '@/components/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard/table'
import { api } from '@/services/api'
import { tarefaType } from '@/types/tarefa'
import { projetoType } from '@/types/projeto'
import { LuInfo, LuPen, LuCirclePlus, LuTrash } from 'react-icons/lu'
import { DialogCreateTarefa } from './dialog-create-tarefa'
import { DialogUpdateTarefa } from './dialog-update-tarefa'
import { DialogInformationTarefa } from './dialog-information-tarefa'
import { DialogTarefaDelete } from './dialog-delete-tarefa'

function formatDate(dateString?: string | null): string {
  if (!dateString) return '-'
  const [datePart] = dateString.split('T')
  const parts = datePart.split('-')
  if (parts.length !== 3) return dateString
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}

const statusLabel: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
}

export default async function ListTarefas() {
  const [{ response }, { response: projetos }] = await Promise.all([
    api<tarefaType[]>('GET', '/tarefas'),
    api<projetoType[]>('GET', '/projetos'),
  ])

  if (!response) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter as tarefas.
      </DashboardContainer>
    )
  }

  const listaProjetos = projetos ?? []

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateTarefa projetos={listaProjetos}>
          <Button size="sm">
            <LuCirclePlus />
            Nova tarefa
          </Button>
        </DialogCreateTarefa>
      </DashboardContainer>
      <DashboardContainer>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {response.map((tarefa: tarefaType) => (
                <TableRow key={tarefa.id}>
                  <TableCell>{tarefa.titulo}</TableCell>
                  <TableCell>{tarefa.projeto?.nome ?? '-'}</TableCell>
                  <TableCell>{tarefa.membro?.nome ?? 'Não atribuído'}</TableCell>
                  <TableCell>{statusLabel[tarefa.status] ?? tarefa.status}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(tarefa.prazo)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <DialogInformationTarefa
                        tarefa={tarefa}
                        projetos={listaProjetos}
                      >
                        <Button variant="default-inverse" size="icon">
                          <LuInfo />
                        </Button>
                      </DialogInformationTarefa>
                      <DialogUpdateTarefa
                        tarefa={tarefa}
                        projetos={listaProjetos}
                      >
                        <Button variant="secondary-inverse" size="icon">
                          <LuPen />
                        </Button>
                      </DialogUpdateTarefa>
                      <DialogTarefaDelete id={tarefa.id}>
                        <Button variant="destructive-inverse" size="icon">
                          <LuTrash />
                        </Button>
                      </DialogTarefaDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {!response.length && (
              <TableCaption>Nenhuma tarefa encontrada.</TableCaption>
            )}
          </Table>
        </div>
      </DashboardContainer>
    </>
  )
}