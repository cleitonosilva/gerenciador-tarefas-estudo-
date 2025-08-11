import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../shared/models/todo.model';

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    // Load todos
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Failure': props<{ error: string }>(),

    // Create todo
    'Create Todo': props<{ todoRequest: CreateTodoRequest }>(),
    'Create Todo Success': props<{ todo: Todo }>(),
    'Create Todo Failure': props<{ error: string }>(),

    // Update todo
    'Update Todo': props<{ updateRequest: UpdateTodoRequest }>(),
    'Update Todo Success': props<{ todo: Todo }>(),
    'Update Todo Failure': props<{ error: string }>(),

    // Delete todo
    'Delete Todo': props<{ id: number }>(),
    'Delete Todo Success': props<{ id: number }>(),
    'Delete Todo Failure': props<{ error: string }>(),

    // Filter and search
    'Set Filter': props<{ filter: 'all' | 'active' | 'completed' }>(),
    'Set Search Term': props<{ searchTerm: string }>(),

    // Toggle todo completion
    'Toggle Todo': props<{ id: number }>(),
    'Toggle Todo Success': props<{ todo: Todo }>(),
    'Toggle Todo Failure': props<{ error: string }>()
  }
});
