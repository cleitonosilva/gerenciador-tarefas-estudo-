import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);

  private readonly STORAGE_KEY = 'todos';
  private todos: Todo[] = this.loadFromStorage();

  constructor() {
    if (this.todos.length === 0) {
      this.todos = [
        {
          id: 1,
          title: 'Estudar Angular 19',
          description: 'Aprender Control Flow, Signals e Standalone Components',
          completed: false,
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: 'Implementar NgRx',
          description: 'Configurar store, actions, reducers e effects',
          completed: true,
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: 'Criar componentes standalone',
          description: 'Desenvolver componentes reutilizáveis',
          completed: false,
          priority: 'low',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.saveToStorage();
    }
  }

  getTodos(): Observable<Todo[]> {
    return of([...this.todos]).pipe(delay(300));
  }

  getTodoById(id: number): Observable<Todo | undefined> {
    const todo = this.todos.find(t => t.id === id);
    return of(todo).pipe(delay(200));
  }

  createTodo(todoRequest: CreateTodoRequest): Observable<Todo> {
    const newTodo: Todo = {
      id: this.generateId(),
      ...todoRequest,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.todos.push(newTodo);
    this.saveToStorage();
    return of(newTodo).pipe(delay(300));
  }

  updateTodo(updateRequest: UpdateTodoRequest): Observable<Todo> {
    const index = this.todos.findIndex(t => t.id === updateRequest.id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    this.todos[index] = {
      ...this.todos[index],
      ...updateRequest,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return of(this.todos[index]).pipe(delay(300));
  }

  deleteTodo(id: number): Observable<void> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    this.todos.splice(index, 1);
    this.saveToStorage();
    return of(void 0).pipe(delay(300));
  }

  private generateId(): number {
    return Math.max(...this.todos.map(t => t.id), 0) + 1;
  }

  private loadFromStorage(): Todo[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
      }
    } catch {
    }
  }
}
