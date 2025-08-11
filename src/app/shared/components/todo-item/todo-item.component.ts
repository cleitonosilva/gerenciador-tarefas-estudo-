import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, PriorityBadgeComponent],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  todo = input.required<Todo>();

  @Output() toggleComplete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo().id);
  }

  onEdit(): void {
    this.edit.emit(this.todo());
  }

  onDelete(): void {
    this.delete.emit(this.todo());
  }
}
