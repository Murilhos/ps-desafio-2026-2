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
import { projetoType } from '@/types/projeto'
import { LuInfo, LuPen, LuCirclePlus, LuTrash } from 'react-icons/lu'
import { DialogUpdateProjeto } from './dialog-update-project'
import { DialogProjetoDelete } from './dialog-delete-project'
import { DialogInformationProjeto } from './dialog-information-project'
import { DialogCreateProjeto } from './dialog-create-project'

/*Formata datas do tipo 'YYY-MM-DD' de forma puramente deterministica
 *Evita desvios de fso horário (day shift) e elimina erros de hidratação (SSR vs Client).
 *Utilizei IA para me auxiliar a montar a função*/
function formatDate(dateString: string): string {
  if (!dateString) return '-'

  const [datePart] = dateString.split('T')
  const parts = datePart.split('-')
  if (parts.length !== 3) return dateString

  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}

export default async function ListProjects() {
  const { response } = await api<projetoType[]>('GET', '/projetos')

  if (!response) {
    return (
      <DashboardContainer className="text-destructive">
        Não foi possível obter os projetos.
      </DashboardContainer>
    )
  }

  return (
    <>
      <DashboardContainer className="flex h-min justify-between space-x-0 gap-y-2.5 max-sm:flex-col">
        <DialogCreateProjeto>
          <Button size="sm">
            <LuCirclePlus />
            Novo projeto
          </Button>
        </DialogCreateProjeto>
      </DashboardContainer>
      <DashboardContainer>
        {/*Contento com rolagem horizontal. IMPLEMENTAÇÃO PARA RESPONSIVIDADE */}
        <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.map((projeto: projetoType) => (
              <TableRow key={projeto.id}>
                <TableCell>{projeto.nome}</TableCell>
                <TableCell>{projeto.nome_cliente}</TableCell>
                <TableCell>
                  {formatDate(projeto.data_inicio)}
                </TableCell>
                <TableCell>
                  {formatDate(projeto.data_fim)}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <DialogInformationProjeto projeto={projeto}>
                    <Button variant="default-inverse" size="icon">
                      <LuInfo />
                    </Button>
                  </DialogInformationProjeto>
                  <DialogUpdateProjeto projeto={projeto}>
                    <Button variant="secondary-inverse" size="icon">
                      <LuPen />
                    </Button>
                  </DialogUpdateProjeto>
                  <DialogProjetoDelete id={projeto.id}>
                    <Button variant="destructive-inverse" size="icon">
                      <LuTrash />
                    </Button>
                  </DialogProjetoDelete>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!response.length && (
            <TableCaption>Nenhum projeto encontrado.</TableCaption>
          )}
        </Table>
        </div>
      </DashboardContainer>
    </>
  )
}
