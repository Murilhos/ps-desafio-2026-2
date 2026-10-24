import { membroType } from './member'
import { tarefaType } from './tarefa'

export type projetoType = {
  id: string
  nome: string
  nome_cliente: string
  descricao: string
  data_inicio: string
  data_fim: string
  status?: 'planejado' | 'ativo' | 'concluido' | 'cancelado' | string
  membros?: membroType[]
  tarefas?: tarefaType[]
  created_at?: string
  updated_at?: string
}

