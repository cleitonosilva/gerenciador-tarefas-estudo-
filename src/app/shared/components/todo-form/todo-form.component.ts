import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  @Output() addTodo = new EventEmitter<CreateTodoRequest>();
  @Output() cancel = new EventEmitter<void>();

  formData = signal<CreateTodoRequest>({
    title: '',
    description: '',
    priority: 'medium'
  });

  isSubmitting = signal(false);

  onSubmit(): void {
    const currentData = this.formData();
    if (currentData.title.trim()) {
      this.isSubmitting.set(true);
      this.addTodo.emit({
        title: currentData.title.trim(),
        description: currentData.description?.trim() || '',
        priority: currentData.priority
      });

      this.formData.set({
        title: '',
        description: '',
        priority: 'medium'
      });

      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  updateTitle(value: string): void {
    this.formData.update(data => ({ ...data, title: value }));
  }

  updateDescription(value: string): void {
    this.formData.update(data => ({ ...data, description: value }));
  }

  updatePriority(value: 'low' | 'medium' | 'high'): void {
    this.formData.update(data => ({ ...data, priority: value }));
  }
}
