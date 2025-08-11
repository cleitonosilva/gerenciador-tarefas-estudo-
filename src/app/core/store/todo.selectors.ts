import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../../shared/models/todo.model';
import { todoReducer } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todo');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectTodosLoading = createSelector(
  selectTodoState,
  (state) => state.loading
);

export const selectTodosError = createSelector(
  selectTodoState,
  (state) => state.error
);

export const selectFilter = createSelector(
  selectTodoState,
  (state) => state.filter
);

export const selectSearchTerm = createSelector(
  selectTodoState,
  (state) => state.searchTerm
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  selectSearchTerm,
  (todos, filter, searchTerm) => {
    let filteredTodos = todos;

    if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(term) ||
        (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    return filteredTodos;
  }
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => todo.completed)
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectTodosCount = createSelector(
  selectAllTodos,
  (todos) => todos.length
);

export const selectCompletedTodosCount = createSelector(
  selectCompletedTodos,
  (todos) => todos.length
);

export const selectActiveTodosCount = createSelector(
  selectActiveTodos,
  (todos) => todos.length
);

export const selectTodosByPriority = createSelector(
  selectAllTodos,
  (todos) => ({
    high: todos.filter(todo => todo.priority === 'high'),
    medium: todos.filter(todo => todo.priority === 'medium'),
    low: todos.filter(todo => todo.priority === 'low')
  })
);
