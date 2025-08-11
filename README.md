# 📋 Gerenciador de Tarefas - Angular 19

Aplicação de gerenciamento de tarefas desenvolvida em Angular 19, demonstrando o uso de tecnologias modernas e features novas implementadas na versão mais atual do FrameWork.

## 🛠️ Stack Tecnológica

### Frontend
- **Angular 19.2.0** - Framework principal
- **TypeScript 5.7.2** - Linguagem de programação
- **Tailwind CSS 4.1.11** - Framework de estilização
- **RxJS 7.8.0** - Programação reativa

### Gerenciamento de Estado
- **NgRx 19.2.1** - Store, Effects, Entity, DevTools
- **Signals** - Estado reativo local

### Desenvolvimento
- **Angular CLI 19.2.15** - Ferramentas de desenvolvimento
- **Jasmine/Karma** - Testes unitários
- **PostCSS/Autoprefixer** - Processamento CSS

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura baseada em features com separação clara de responsabilidades:

```
src/app/
├── core/                    # Funcionalidades centrais
│   └── store/              # Gerenciamento de estado NgRx
│       ├── todo.actions.ts
│       ├── todo.reducer.ts
│       ├── todo.effects.ts
│       ├── todo.selectors.ts
│       └── index.ts
├── features/               # Módulos de funcionalidade
│   └── todo/              # Feature principal de tarefas
│       ├── todo.component.ts
│       ├── todo.component.html
│       └── todo.component.scss
├── shared/                # Componentes e serviços compartilhados
│   ├── components/        # Componentes reutilizáveis
│   │   ├── confirm-modal/
│   │   ├── edit-modal/
│   │   ├── import-posts/
│   │   ├── loading-spinner/
│   │   ├── priority-badge/
│   │   ├── toast/
│   │   ├── toast-container/
│   │   ├── todo-form/
│   │   ├── todo-item/
│   │   └── index.ts
│   ├── models/           # Interfaces e tipos
│   │   └── todo.model.ts
│   └── services/         # Serviços compartilhados
│       ├── api.service.ts
│       ├── toast.service.ts
│       └── todo.service.ts
└── app.component.*       # Componente raiz
```

## 🎯 Funcionalidades Implementadas

### Gerenciamento de Tarefas
- ✅ Criação de novas tarefas com título, descrição e prioridade
- ✅ Marcação de tarefas como concluídas/pendentes
- ✅ Edição completa de tarefas existentes
- ✅ Exclusão de tarefas com confirmação
- ✅ Filtros por status (Todas/Ativas/Concluídas)
- ✅ Busca por título ou descrição
- ✅ Sistema de prioridades (Baixa/Média/Alta)
- ✅ Limpeza em lote de tarefas concluídas

### Interface e UX
- ✅ Design responsivo com Tailwind CSS
- ✅ Animações e transições suaves
- ✅ Estados de carregamento
- ✅ Tratamento de erros
- ✅ Estados vazios informativos
- ✅ Estatísticas em tempo real
- ✅ Sistema de notificações toast
- ✅ Modais de confirmação e edição
- ✅ Drag & drop para reordenar tarefas

### Integração Externa
- ✅ Importação de posts da API JSONPlaceholder
- ✅ Gerenciamento de dados de diferentes fontes (manual/API)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

### Instalação e Execução
```bash
# Clonar o repositório
git clone <repository-url>
cd angular-interview-project

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
# ou
ng serve
```

A aplicação estará disponível em `http://localhost:4200`

### Build para Produção
```bash
npm run build
```

## 💡 Demonstrações Técnicas

### Control Flow Syntax (Angular 19)
```typescript
// Uso da nova sintaxe @if e @for
@if (loading()) {
  <app-loading-spinner />
}

@for (todo of filteredTodos(); track todo.id) {
  <app-todo-item [todo]="todo" />
}
```

### Standalone Components
```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, PriorityBadgeComponent],
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  onToggle = output<number>();
}
```

### Signals Reativos
```typescript
// Estado local reativo
loading = signal(false);
currentFilter = signal<'all' | 'active' | 'completed'>('all');

// Signals computados
filteredTodos = computed(() => {
  return this.allTodos().filter(todo => {
    // Lógica de filtragem
  });
});
```

### NgRx Store
```typescript
// Actions com createActionGroup
export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Create Todo': props<{ todoRequest: CreateTodoRequest }>(),
    'Update Todo': props<{ todoRequest: UpdateTodoRequest }>(),
    'Delete Todo': props<{ id: number }>()
  }
});

// Effects para operações assíncronas
loadTodos$ = createEffect(() => this.actions$.pipe(
  ofType(TodoActions.loadTodos),
  mergeMap(() => this.todoService.getTodos()
    .pipe(
      map(todos => TodoActions.loadTodosSuccess({ todos })),
      catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
    ))
));
```

## 📊 Gerenciamento de Estado

A aplicação utiliza NgRx para gerenciamento centralizado de estado:

- **Store**: Estado global da aplicação
- **Actions**: Eventos disparados pelos componentes
- **Reducers**: Funções puras que atualizam o estado
- **Effects**: Lida com operações assíncronas e side effects
- **Selectors**: Acesso otimizado e memoizado ao estado
- **DevTools**: Debugging em tempo real

### Estado da Aplicação
```typescript
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
  searchTerm: string;
}
```

## 🎨 Design System

- **Framework**: Tailwind CSS para estilização utilitária
- **Cores**: Paleta moderna com gradientes
- **Tipografia**: Sistema de fontes responsivo
- **Componentes**: Biblioteca de componentes reutilizáveis
- **Responsividade**: Design mobile-first

## 🔧 Estrutura de Dados

### Modelo de Tarefa
```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  source?: 'manual' | 'api';
  createdAt: Date;
  updatedAt: Date;
}
```

## 📈 Métricas e Estatísticas

A aplicação fornece estatísticas em tempo real:
- Total de tarefas
- Tarefas ativas
- Tarefas concluídas
- Progresso de conclusão

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
ng test --code-coverage
```

## 📦 Scripts Disponíveis

- `npm start` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run watch` - Build em modo watch
- `npm test` - Executa testes unitários

## 📝 Notas de Desenvolvimento

Este projeto demonstra:
- Domínio das funcionalidades modernas do Angular 19
- Implementação de arquitetura escalável
- Uso efetivo de padrões de gerenciamento de estado
- Desenvolvimento de componentes reutilizáveis
- Aplicação de boas práticas de UX/UI
- Integração com APIs externas
- Tratamento robusto de erros e estados

---

**Desenvolvido com Angular 19 e NgRx** 🚀
