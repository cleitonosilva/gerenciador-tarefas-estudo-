import { createReducer, on } from '@ngrx/store';
import { TodoState } from '../../shared/models/todo.model';
import { TodoActions } from './todo.actions';

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filter: 'all',
  searchTerm: ''
};

export const todoReducer = createReducer(
  initialState,

  // Load todos
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),

  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Create todo
  on(TodoActions.createTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TodoActions.createTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
    loading: false
  })),

  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Update todo
  on(TodoActions.updateTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TodoActions.updateTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    loading: false
  })),

  on(TodoActions.updateTodoFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Delete todo
  on(TodoActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TodoActions.deleteTodoSuccess, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id),
    loading: false
  })),

  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Toggle todo
  on(TodoActions.toggleTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TodoActions.toggleTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    loading: false
  })),

  on(TodoActions.toggleTodoFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Filter and search
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter
  })),

  on(TodoActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  }))
);
