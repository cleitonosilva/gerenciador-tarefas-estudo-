import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../shared/models/todo.model';
import { TodoActions, selectFilteredTodos, selectTodosLoading, selectTodosError, selectFilter, selectSearchTerm, selectTodosCount, selectCompletedTodosCount, selectActiveTodosCount } from '../../core/store';
import { ToastService } from '../../shared/services/toast.service';
import { TodoFormComponent } from '../../shared/components/todo-form/todo-form.component';
import { TodoItemComponent } from '../../shared/components/todo-item/todo-item.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { EditModalComponent } from '../../shared/components/edit-modal/edit-modal.component';
import { ImportPostsComponent } from '../../shared/components/import-posts/import-posts.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoItemComponent,
    LoadingSpinnerComponent,
    ConfirmModalComponent,
    EditModalComponent,
    ImportPostsComponent
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @ViewChild('importPostsComponent') importPostsComponent!: ImportPostsComponent;

  private toastService = inject(ToastService);
  private store = inject(Store);
  private nextTodoId = signal(1000);

  loading = signal(false);
  error = signal<string | null>(null);
  currentFilter = signal<'all' | 'active' | 'completed'>('all');
  currentSearchTerm = signal('');

  allTodos = signal<Todo[]>([]);
  filteredTodos = signal<Todo[]>([]);
  todosCount = signal(0);
  completedTodosCount = signal(0);
  activeTodosCount = signal(0);

  showDeleteModal = signal(false);
  todoToDelete = signal<Todo | null>(null);

  showEditModal = signal(false);
  todoToEdit = signal<Todo | null>(null);

  ngOnInit(): void {
    this.loadTodos();

    const initialTodos: Todo[] = [
      {
        id: this.generateUniqueId(),
        title: 'Estudar Angular 19',
        description: 'Aprender as novas features como Signals e Control Flow',
        completed: false,
        priority: 'high',
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateUniqueId(),
        title: 'Implementar NgRx',
        description: 'Configurar store, actions, reducers e effects',
        completed: true,
        priority: 'medium',
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateUniqueId(),
        title: 'Criar componentes standalone',
        description: 'Desenvolver componentes independentes sem NgModules',
        completed: false,
        priority: 'low',
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.store.dispatch(TodoActions.loadTodosSuccess({ todos: initialTodos }));
    this.allTodos.set(initialTodos);
    this.applyFilters();
    this.updateCounts();
    this.loading.set(false);
  }

  private applyFilters(): void {
    const allTodos = this.allTodos();
    const filter = this.currentFilter();
    const searchTerm = this.currentSearchTerm().toLowerCase();

    let filtered = allTodos;

    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm))
      );
    }

    this.filteredTodos.set(filtered);
  }

  private updateCounts(): void {
    const allTodos = this.allTodos();
    this.todosCount.set(allTodos.length);
    this.completedTodosCount.set(allTodos.filter(todo => todo.completed).length);
    this.activeTodosCount.set(allTodos.filter(todo => !todo.completed).length);
  }

  loadTodos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.store.dispatch(TodoActions.loadTodos());
  }

  private generateUniqueId(): number {
    const currentId = this.nextTodoId();
    this.nextTodoId.set(currentId + 1);
    return currentId;
  }

  onCancelAdd(): void {
  }

  onAddTodo(todoRequest: CreateTodoRequest, source: 'manual' | 'api' = 'manual'): void {
    const newTodo: Todo = {
      id: this.generateUniqueId(),
      title: todoRequest.title,
      description: todoRequest.description,
      priority: todoRequest.priority,
      source: source,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.allTodos.update(todos => [...todos, newTodo]);
    this.applyFilters();
    this.updateCounts();

    this.store.dispatch(TodoActions.createTodoSuccess({ todo: newTodo }));
    this.toastService.success('Tarefa adicionada com sucesso!');
  }

    onToggleComplete(id: number): void {
    const currentAllTodos = this.allTodos();
    const updatedAllTodos = currentAllTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    );

    this.allTodos.set(updatedAllTodos);
    this.applyFilters();
    this.updateCounts();

    const updatedTodo = updatedAllTodos.find(todo => todo.id === id);
    if (updatedTodo) {
      this.store.dispatch(TodoActions.toggleTodoSuccess({ todo: updatedTodo }));
    }
  }

  onEditTodo(todo: Todo): void {
    this.todoToEdit.set(todo);
    this.showEditModal.set(true);
  }

  onDeleteTodo(todo: Todo): void {
    this.todoToDelete.set(todo);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const todo = this.todoToDelete();
    if (todo) {
      this.allTodos.update(todos => todos.filter(t => t.id !== todo.id));
      this.applyFilters();
      this.updateCounts();

      this.store.dispatch(TodoActions.deleteTodoSuccess({ id: todo.id }));
      this.toastService.warning('Tarefa excluída com sucesso!');
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.todoToDelete.set(null);
  }

  onSaveEdit(todoRequest: UpdateTodoRequest): void {
    const todo = this.todoToEdit();
    if (todo) {
      const updatedTodo = { ...todo, ...todoRequest, updatedAt: new Date() };

      this.allTodos.update(todos =>
        todos.map(t => t.id === todo.id ? updatedTodo : t)
      );

      this.applyFilters();
      this.updateCounts();

      this.store.dispatch(TodoActions.updateTodoSuccess({ todo: updatedTodo }));
      this.toastService.success('Tarefa atualizada com sucesso!');
    }
    this.closeEditModal();
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.todoToEdit.set(null);
  }

  onFilterChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value as 'all' | 'active' | 'completed';
    this.currentFilter.set(filter);
    this.store.dispatch(TodoActions.setFilter({ filter }));
    this.applyFilters();
  }

  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.currentSearchTerm.set(searchTerm);
    this.store.dispatch(TodoActions.setSearchTerm({ searchTerm }));
    this.applyFilters();
  }

  onImportPosts(todoRequest: CreateTodoRequest): void {
    this.onAddTodo(todoRequest, 'api');
  }

  onPostRemoved(postId: number): void {
  }

  onClearCompleted(): void {
    const currentAllTodos = this.allTodos();
    const updatedAllTodos = currentAllTodos.filter(todo => !todo.completed);

    this.allTodos.set(updatedAllTodos);
    this.applyFilters();
    this.updateCounts();

    const removedTodos = currentAllTodos.filter(todo => todo.completed);
    removedTodos.forEach(todo => {
      this.store.dispatch(TodoActions.deleteTodoSuccess({ id: todo.id }));
      this.toastService.warning('Tarefa excluída com sucesso!');
    });
  }

  private dragOver = signal(false);

  isDragOver(): boolean {
    return this.dragOver();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

    onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    if (event.dataTransfer) {
      try {
        const data = event.dataTransfer.getData('application/json');
        if (data) {
          const todoRequest: CreateTodoRequest = JSON.parse(data);
          const postId = event.dataTransfer.getData('text/plain');

          this.onAddTodo(todoRequest, 'api');

          if (postId && this.importPostsComponent) {
            this.importPostsComponent.removePost(parseInt(postId));
          }

          this.toastService.success('Tarefa criada e post removido da lista!');
        }
      } catch (error) {
        console.error('Erro ao processar dados do drag and drop:', error);
        this.toastService.error('Erro ao criar tarefa por drag and drop');
      }
    }
  }
}
