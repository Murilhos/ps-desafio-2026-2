# Adapti Project Template
## Iniciando projeto
Clone o projeto para sua máquina:
```bash
    git clone link-do-projeto
```
### Laravel
Dentro da pasta `backend` siga as seguintes instruções.
1. Instale as dependências:
    ```bash
    composer install
    ```
2. Crie o arquivo de variáveis globais do projeto **backend**:
    ```bash
    cp .env.example .env
    ```
3. Após isso insira as credenciais do banco de dados no arquivo `.env`
4. Crie o schema no banco de dados. O nome do banco deve ser o valor contido na variável `DB_DATABASE` presente no arquivo `.env`. 
5. Gere a chave do projeto:
    ```bash
    php artisan key:generate
    ```
6. Crie o link simbólico com o diretório storage:
    ```bash
    php artisan storage:link
    ```
7. Rode as migrations:
    ```bash
    php artisan migrate --seed
    ```
   1. Caso as migrations já tenham sido rodadas anteriormente no seu banco de dados, execute o comando:
        ```bash
        php artisan migrate:fresh --seed
        ```
8. Inicie o servidor **backend**:
    ```bash
    php artisan serve
    ```
    1. O servidor **backend** será iniciado por padrão no endereço `http://127.0.0.1:8000`. 
### React.js/Next.js
Tenha o gerenciador de pacotes <a href="https://pnpm.io/pt/installation">pnpm</a> instalado globalmente em sua máquina.

Dentro da pasta `frontend` siga as seguintes instruções.
1. Instale as dependências:
    ```bash
    pnpm install
    ```
2. Crie o arquivo de variáveis globais do projeto **frontend**:
    ```bash
    cp .env.local.example .env.local
    ```
3. Inicie o servidor **frontend**:
    ```bash
    pnpm dev
    ```
    1. O servidor **frontend** será iniciado por padrão no endereço `http://127.0.0.1:3000`. 


# Decisões Arquiteturais e Modelagem de Dados
Esta seção documenta o processo de engenharia de requisitos, a modelagem relacional do banco de dados e as decisões arquiteturais adotadas para garantir a integridade dos dados e o cumprimento das regras de negócio da plataforma de gestão da EJ.

---

## 1. Como Cheguei à Modelagem (Do Relato ao Modelo Relacional)

A modelagem partiu da análise das dores operacionais relatadas pela Diretoria de Projetos(que seria o cliente do PS):
1. **Descentralização do acompanhamento diário:** Existiam apenas `Projetos` e `Membros`, sem granularidade das entregas. Isso levou à criação da entidade **`Tarefas` (`tasks`)**.

2. **Responsabilidade clara:** O relato exige que *"cada tarefa precisa ser obrigatoriamente atribuída a um membro específico"*. Portanto, na tabela de tarefas, a chave estrangeira `membro_id` foi definida como obrigatória (`NOT NULL`), estabelecendo uma relação **1:N** estrita entre Membro e Tarefas.

3. **Alocação em múltiplos projetos e controle de sobrecarga:** Como um projeto possui vários membros e um membro participa de vários projetos, consolida-se a relação **N:N** através da tabela associativa (pivô) `membro_projeto`, protegida por restrição de unicidade composta `UNIQUE (projeto_id, membro_id)` para impedir alocações duplicadas (RN07).

4. **Campo `status` ausente na base original:** A tabela `projetos` do repositório base não possuía o campo `status`, necessário para implementar a trava de alocação (RN08). Foi adicionado via nova
migration com os valores `planejado`, `ativo`, `concluido` e `cancelado`, e valor padrão `planejado`.

---

## 2. Levantamento de Requisitos e Regras de Negócio
1. Levantamento de requisitos 
    Atores

    - **Diretor de Projetos:** cadastra projetos, membros e tarefas e gerencia alocações.
    - **Sistema:** aplica validações e a trava de alocação. 

2. Requisitos funcionais

    RF01  -  Cadastrar, editar, listar e excluir projetos, com validação de datas.

    RF02 - Cadastrar, editar, listar e excluir membros, com validação de dados.

    RF03 - Alocar e desalocar membros em projetos (relação N:N).

    RF04 - Bloquear a alocação de um membro em um 3º projeto ativo, com erro claro.

    RF05 - Cadastrar, editar, listar e excluir tarefas vinculadas a um projeto.

    RF06 - Atribuir cada tarefa a um membro (obrigatório).

    RF07 - Alterar o status de uma tarefa.

    RF08 - Filtrar tarefas por projeto, membro e status.

    RF09 - Exibir os erros de validação por campo e os erros da trava na tela, de forma amigável.


3. Requisitos não funcionais

    RNF01 - API REST em Laravel, front em Next.js, estilização apenas com Tailwind.

    RNF02 - Interface responsiva (mobile, tablet e desktop).

    RNF03 - Erros de validação em JSON, código HTTP 422, mensagens em português.

    RNF04 - A trava deve ser segura contra concorrência (transação e bloqueio de linha).

    RNF05 - Integridade garantida também no banco (FKs, unique, not null).

    RNF06 - Sem divergência de renderização entre servidor e cliente (hydration).


4. Regras de negócio

    RN01 - A data de término do projeto deve ser maior ou igual à data de início (vale no cadastro e na edição).

    RN02 - E-mail do membro é obrigatório, em formato válido e único. Nome é obrigatório, com tamanho máximo.

    RN03 - Uma tarefa pertence a exatamente um projeto. Um projeto tem zero ou mais tarefas.

    RN04 - Toda tarefa tem exatamente um membro responsável (membro_id obrigatório).

    RN05 - O responsável pela tarefa deve estar alocado no projeto da tarefa (decisão de projeto: evita tarefa para quem não participa).

    RN06 - Um projeto pode ter vários membros ao mesmo tempo.

    RN07 - Um membro não pode ser alocado duas vezes no mesmo projeto.

    RN08 - Um membro não pode estar alocado em mais de 2 projetos com status ativo simultaneamente.

    RN09 - A RN08 é verificada em dois momentos: ao alocar um membro a um projeto ativo e ao ativar um projeto que já tem membros. O projeto avaliado não conta na contagem prévia.

    RN10 - Projetos concluido, cancelado ou planejado não contam para o limite.

    RN11 - Não se criam tarefas em projeto concluido ou cancelado (decisão de projeto).

    RN12 - Não se desaloca um membro que ainda tenha tarefas não concluídas no projeto; elas devem ser reatribuídas antes (decisão de projeto).

    RN13 - Violações retornam 422 com mensagem clara, por exemplo: “Ana Souza já está alocada em 2 projetos ativos e não pode ser alocada em outro.” 

> **RN05, RN11 e RN12** são decisões de projeto não explicitadas no relato. Foram adicionadas para
> garantir consistência dos dados e evitar estados inválidos no sistema.

---

## 3. Diagrama Entidade-Relacionamento (DER)

Mermaid: É uma linguagem de texto para criar diagramas.
Eloquent: É o ORM do Laravel. ORM significa que ele traduz objetos PHP para o banco de dados e vice-versa, sem precisar escrever SQL na maioria dos casos.

O diagrama abaixo (renderizado via Mermaid) representa a estrutura física e lógica das tabelas e suas cardinalidades:

```mermaid
erDiagram
    PROJETOS ||--o{ MEMBRO_PROJETO : "possui alocados (1:N)"
    MEMBROS ||--o{ MEMBRO_PROJETO : "é alocado em (1:N)"
    PROJETOS ||--o{ TAREFAS : "contém (1:N)"
    MEMBROS ||--o{ TAREFAS : "é responsável por (1:N)"

    PROJETOS {
        uuid id PK
        string nome "NOT NULL"
        string nome_cliente "NOT NULL"
        text descricao "NOT NULL"
        date data_inicio "NOT NULL"
        date data_fim "NOT NULL, >= data_inicio"
        enum status "planejado|ativo|concluido|cancelado"
        timestamp created_at
        timestamp updated_at
    }

    MEMBROS {
        uuid id PK
        string nome "NOT NULL, max 255"
        string email "NOT NULL, UNIQUE"
        string senha "NOT NULL, hashed"
        string cor_favorita "NULLABLE"
        date data_aniversario "NOT NULL"
        string image "NULLABLE"
        timestamp created_at
        timestamp updated_at
    }

    MEMBRO_PROJETO {
        uuid id PK
        uuid projeto_id FK "NOT NULL, CASCADE"
        uuid membro_id FK "NOT NULL, CASCADE"
        unique projeto_id_membro_id "RN07"
        timestamp created_at
        timestamp updated_at
    }

    TAREFAS {
        uuid id PK
        uuid projeto_id FK "NOT NULL, CASCADE"
        uuid membro_id FK "NOT NULL, RESTRICT"
        string titulo "NOT NULL"
        text descricao "NULLABLE"
        enum status "pendente|em_andamento|concluida"
        date prazo "NULLABLE"
        timestamp created_at
        timestamp updated_at
    }
```

---

## 4. Lógica da Trava de Alocação (RN08)

A trava impede que um membro seja alocado em mais de 2 projetos `ativo` simultaneamente. Foi implementada no `AlocacaoService` por três motivos:

1. **Reutilização:** a mesma lógica roda em dois momentos distintos (ao alocar e ao ativar um projeto), então centralizá-la num Service evita duplicação de código.

2. **Segurança contra concorrência:** a verificação usa `DB::transaction()` com `lockForUpdate()` no registro do membro, garantindo que duas requisições simultâneas não consigam furar o limite.

3. **Separação de responsabilidades:** o Controller apenas orquestra, o Service aplica a regra. Isso segue o princípio SRP (Single Responsibility Principle).



### Resumo dos Relacionamentos no Eloquent (Laravel)
* **`Projeto` (`Project`)**:
  * `belongsToMany(Membro::class, 'membro_projeto')`: Relação N:N de alocação da equipe.
  * `hasMany(Tarefa::class)`: Relação 1:N (um projeto possui zero ou muitas tarefas — **RN03**).
* **`Membro` (`Member`)**:
  * `belongsToMany(Projeto::class, 'membro_projeto')`: Relação N:N com os projetos em que atua.
  * `hasMany(Tarefa::class)`: Relação 1:N (um membro pode ser responsável por várias tarefas).
* **`Tarefa` (`Task`)**:
  * `belongsTo(Projeto::class)`: Toda tarefa pertence obrigatoriamente a um único projeto (**RN03**).
  * `belongsTo(Membro::class)`: Toda tarefa possui obrigatoriamente um único membro responsável (**RN04**).

---

## Extras


### 1. Factories e Seeders de Tarefas

Criados `TarefaFactory` e `TarefaSeeder` seguindo o padrão do projeto.

A Factory possui quatro estados:
- `pendente()` → tarefa com status pendente
- `emAndamento()` → tarefa em andamento
- `concluida()` → tarefa concluída
- `atrasada()` → tarefa pendente com prazo no passado

O Seeder respeita a RN08 ao alocar membros, verificando o limite antes
de cada alocação via `syncWithoutDetaching`.

---

### 2. Alterações/ Correções do código

**Backend:**
- `StoreProjetoRequest` e `UpdateProjetoRequest`: adicionada validação
de datas via `withValidator`.
- `StoreMembroRequest`: corrigido `authorize()` de `false` para `true`,
adicionada regra `Rule::unique` no e-mail.
- `UpdateMembroRequest`: adicionado `Rule::unique()->ignore()` para
permitir edição do próprio e-mail.
- `ProjetoController` e `MembroController`: corrigido `Route::resource`
para `Route::apiResource`.
- `add_status_to_projetos_table`: A tabela projetos original não tinha status,
que é necessário para a trava de alocação, então criou-se uma nova migration e
adição ao $fillable do Model.
- `create_membro_projeto_table`: O attach() tentava inserir sem gerar o UUID da pivot,
causando erro de banco. A solução foi a criação de `MembroProjeto` extends `Pivot` com `HasUuids`, 
e adição de `->using(MembroProjeto::class)` nos relacionamentos `belongsToMany` de `Projeto`
e `Membro`.


**Frontend:**
- `actions/member.ts` e `actions/projeto.ts`: alterado o método da função
update de 'PUT' para 'POST', para que as alterações sejam exibidas na tela.
- `action/projeto.ts`: Adicionada funções para alocação de membros no projeto.
- `_components/form-fields-member.tsx` e `_components/form-fields-project.tsx`:
Adequações para as novas implementações, como a adição de status no forms do project
- `_components/list-project.tsx`: Importação do ícone LuUsers e adição do componente
- `_components/dialog-allocate-member`: Criação do modal par alocação de membros
DialogAllocateMember na coluna de ações à tabela. Criação de uma função utilitária para 
converter as strings YYYY-MM-DD para DD-MM-YYYY, evitando erros de hidratação entre SSR e Client.
- `src/app/(dashboard)/admin/tarefas/page.tsx`: Página principal da rota /admin/tarefas no painel administrativo. 
- `_components/list-tarefas.tsx`: Componente de tabela para listagem das tarefas, formatação de status/prazos e acionamento dos modais de ação.
- `_components/form-fields-tarefa.tsx`: Estrutura dos campos de formulário de tarefas (titulo, descricao, seleção de projeto em projeto_id, seleção de membro alocado em membro_id, status e prazo).
- `_components/dialog-create-tarefa.tsx`: Modal de cadastro de nova tarefa.
- `_components/dialog-update-tarefa.tsx`: Modal de atualização de tarefa existente.
- `_components/dialog-information-tarefa.tsx`: Modal de visualização de detalhes da tarefa (modo somente leitura).
- `_components/dialog-delete-tarefa.tsx`: Modal de confirmação e exclusão de tarefa.
- Componente de Sidebar / Navegação: Inclusão da rota Tarefas (/admin/tarefas) no menu lateral do dashboard, abaixo de Membros e Projetos

---
# Demonstração e Testes

## PROJETO

### Criação e exclusão de projetos
![Criação de um Projeto](./docs/criacaoProjeto.png)

![Projetos Criados](./docs/projetoCriados.png)

![Alocacao](./docs/alocacao.png)

![Exclusão Projeto](./docs/exclusao.png)

![Excluido](./docs/excluido.png)

## MEMBRO

### Criação e edição de membro
![Criação Novo Membro](./docs/criacaoMembro.png)

![Editar Membro](./docs/editar.png)

![Edição Concluída](./docs/edicaoConcluida.png)

## TAREFAS

### Criação de tarefas

![Tarefa Criada](./docs/tarefaCriada.png)

---


# USOS DE IA
> **Onde a IA ajudou:**
> - Explicação de como funciona o Mermaid para a criação da tabela no README
> - Explicação de conceitos (hydration mismatch, lockForUpdate, pivot)
> - Depuração de erros durante os testes no Postman
> - Explicação da necessidade de aplicar o hash na senha
> - Explicação de como combinar as regras sometimes e required para validar apenas os campos efetivamente enviados na requisição
> - Auxílio no diagnóstico do motivo pelo qual requisições PUT contendo FormData (especialmente com upload de imagem)
>   retornavam sucesso sem alterar os dados no PHP/Laravel
> - Explicações de como funciona a comunicação entre o front e backend
> - Pesquisa de boas práticas para se fazer, afim de preservar o histórico do código legado
> - Auxílio nas pesquisa sobre as classes e bibliotecas
> - Sugestões de formatações dos textos no back/frontend
> - Auxilio na resolução dos problemas das datas de aniversário que não queriam ser exibidas

> **Limitações/Dificuldades encontradas:**
> - Manipulaçao do Tailwind, certas funcionalidades não funcionaram como esperado
> - Algumas funcionalidades nos modais não funcionaram conforme o esperado,
>   ao tentar encontrar uma forma de contornar a IA me aconselhava a realizar mudanças que iam
>   longe do que foi passado em aula, então optei por não fazer
> - O código base precisou ser alterado algumas vezes (principalmente no frontend), mas como
>   estava prezando pela integridade do código legado, e evitar de quebrar alguma coisa, optei
>   por emxer pouco
