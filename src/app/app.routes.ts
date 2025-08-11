import { Routes } from '@angular/router';
import { TodoComponent } from './features/todo/todo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { path: 'todos', component: TodoComponent },
  { path: '**', redirectTo: '/todos' }
];
