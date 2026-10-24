import { DashboardHeader, DashboardHeaderDescription, DashboardHeaderTitle, DashboardMain } from '@/components/dashboard/dashboard-items'
import { LuListTodo } from 'react-icons/lu'
import ListTarefas from './_components/list-tarefas'

export default async function Page() {
  return (
    <>
      <DashboardHeader>
        <DashboardHeaderTitle>
          <LuListTodo />
          Tarefas
        </DashboardHeaderTitle>
        <DashboardHeaderDescription>
          Gerencie as tarefas vinculadas aos projetos e membros da equipe.
        </DashboardHeaderDescription>
      </DashboardHeader>
      <DashboardMain>
        <ListTarefas />
      </DashboardMain>
    </>
  )
}