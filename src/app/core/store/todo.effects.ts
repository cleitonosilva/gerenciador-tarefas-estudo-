import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TodoActions } from './todo.actions';
import { TodoService } from '../../shared/services/todo.service';

@Injectable()
export class TodoEffects {

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() => this.todoService.getTodos()
        .pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
        ))
    );
  });

  createTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.createTodo),
      mergeMap(({ todoRequest }) => this.todoService.createTodo(todoRequest)
        .pipe(
          map(todo => TodoActions.createTodoSuccess({ todo })),
          catchError(error => of(TodoActions.createTodoFailure({ error: error.message })))
        ))
    );
  });

  updateTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      mergeMap(({ updateRequest }) => this.todoService.updateTodo(updateRequest)
        .pipe(
          map(todo => TodoActions.updateTodoSuccess({ todo })),
          catchError(error => of(TodoActions.updateTodoFailure({ error: error.message })))
        ))
    );
  });

  deleteTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(({ id }) => this.todoService.deleteTodo(id)
        .pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError(error => of(TodoActions.deleteTodoFailure({ error: error.message })))
        ))
    );
  });

  toggleTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      switchMap(({ id }) => this.todoService.getTodoById(id)
        .pipe(
          mergeMap(todo => {
            if (!todo) {
              throw new Error('Todo not found');
            }
            return this.todoService.updateTodo({
              id,
              completed: !todo.completed
            });
          }),
          map(todo => TodoActions.toggleTodoSuccess({ todo })),
          catchError(error => of(TodoActions.toggleTodoFailure({ error: error.message })))
        ))
    );
  });

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}
}
