# 📋 Gerenciador de Tarefas - Angular 19

Este projeto demonstra o conhecimento em Angular 19, incluindo **Control Flow Syntax**, **Standalone Components**, **Signals** e **NgRx**. Foi desenvolvido especificamente para uma entrevista técnica.

## 🚀 Tecnologias Demonstradas

### Angular 19 Features
- ✅ **Control Flow Syntax** (@if, @for, @switch)
- ✅ **Standalone Components** (sem NgModules)
- ✅ **Signals** (reactive primitives)
- ✅ **Input/Output Functions** (nova sintaxe)
- ✅ **Router Standalone**

### NgRx State Management
- ✅ **Actions** (createActionGroup)
- ✅ **Reducers** (createReducer)
- ✅ **Effects** (createEffect)
- ✅ **Selectors** (createSelector)
- ✅ **Store DevTools**

### Arquitetura e Padrões
- ✅ **Feature-based Architecture**
- ✅ **Shared Components**
- ✅ **Core Services**
- ✅ **TypeScript Interfaces**
- ✅ **Reactive Programming**

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   └── store/
│   │       ├── todo.actions.ts
│   │       ├── todo.reducer.ts
│   │       ├── todo.effects.ts
│   │       ├── todo.selectors.ts
│   │       └── index.ts
│   ├── features/
│   │   └── todo/
│   │       └── todo.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   ├── priority-badge/
│   │   │   ├── todo-form/
│   │   │   └── todo-item/
│   │   ├── models/
│   │   │   └── todo.model.ts
│   │   └── services/
│   │       └── todo.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
└── styles.scss
```

## 🎯 Funcionalidades Implementadas

### Gerenciamento de Tarefas
- ✅ Criar nova tarefa
- ✅ Marcar como concluída/pendente
- ✅ Editar tarefa (estrutura preparada)
- ✅ Excluir tarefa
- ✅ Filtrar por status (Todas/Ativas/Concluídas)
- ✅ Buscar por título ou descrição
- ✅ Prioridades (Baixa/Média/Alta)

### Interface Moderna
- ✅ Design responsivo
- ✅ Animações e transições
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Estatísticas em tempo real

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o projeto
git clone <repository-url>
cd angular-interview-project

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Ou
ng serve
```

### Build para Produção
```bash
npm run build
```

## 🔧 Demonstrações Técnicas

### 1. Control Flow Syntax (@if, @for)
```typescript
// Demonstração no template
@if (loading()) {
  <app-loading-spinner />
}

@for (todo of filteredTodos(); track todo.id) {
  <app-todo-item [todo]="todo" />
}
```

### 2. Standalone Components
```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, PriorityBadgeComponent],
  // ...
})
export class TodoItemComponent {
  todo = input.required<Todo>();
}
```

### 3. Signals
```typescript
// Signals reativos
loading = signal(false);
error = signal<string | null>(null);
currentFilter = signal<'all' | 'active' | 'completed'>('all');

// Computed signals
filteredTodos = computed(() => {
  // Lógica de filtragem
});
```

### 4. NgRx Store
```typescript
// Actions
export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Create Todo': props<{ todoRequest: CreateTodoRequest }>(),
    // ...
  }
});

// Effects
loadTodos$ = createEffect(() => this.actions$.pipe(
  ofType(TodoActions.loadTodos),
  mergeMap(() => this.todoService.getTodos()
    .pipe(
      map(todos => TodoActions.loadTodosSuccess({ todos })),
      catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
    ))
));
```

## 📊 Estado da Aplicação

O projeto utiliza NgRx para gerenciamento de estado com:

- **Estado**: Lista de tarefas, loading, erros, filtros
- **Actions**: Disparadas por componentes
- **Effects**: Lida com operações assíncronas
- **Selectors**: Acesso otimizado ao estado
- **DevTools**: Debugging em tempo real

## 🎨 Design System

- **Cores**: Gradiente moderno com tons de azul/roxo
- **Tipografia**: Segoe UI para melhor legibilidade
- **Componentes**: Reutilizáveis e consistentes
- **Responsivo**: Funciona em desktop e mobile

## 🔍 Pontos de Destaque para Entrevista

1. **Arquitetura Limpa**: Separação clara entre features, shared e core
2. **Componentes Standalone**: Sem dependência de NgModules
3. **Control Flow Moderno**: Uso da nova sintaxe do Angular 19
4. **Signals Reativos**: Estado local reativo
5. **NgRx Completo**: Implementação completa do padrão Redux
6. **TypeScript**: Tipagem forte em toda aplicação
7. **Responsividade**: Design adaptável
8. **UX/UI**: Interface moderna e intuitiva

## 🚀 Próximos Passos (Melhorias)

- [ ] Implementar edição de tarefas
- [ ] Adicionar drag & drop para reordenar
- [ ] Implementar categorias/tags
- [ ] Adicionar notificações toast
- [ ] Implementar testes unitários
- [ ] Adicionar PWA capabilities
- [ ] Implementar tema escuro/claro

## 📝 Notas para Entrevista

Este projeto demonstra:
- Conhecimento profundo do Angular 19
- Familiaridade com padrões modernos de desenvolvimento
- Capacidade de implementar arquitetura escalável
- Entendimento de gerenciamento de estado
- Habilidades de UI/UX
- Boas práticas de código

---

**Desenvolvido para entrevista técnica - Angular 19** 🎯
# gerenciador-tarefas-estudo-
