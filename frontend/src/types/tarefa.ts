import { membroType } from './member'
import { projetoType } from './projeto'

export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida' | 'atrasada'

export type tarefaType = {
    id: string
    projeto_id: string
    membro_id?: string | null
    titulo: string
    descricao?: string | null
    status: TarefaStatus
    prazo?: string | null
    projeto?: projetoType
    membro?: membroType | null
    created_at?: string
    updated_at?: string
}