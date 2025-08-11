import { Component, EventEmitter, Output, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, UpdateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {
  show = input<boolean>(false);
  todo = input<Todo | null>(null);

  @Output() save = new EventEmitter<UpdateTodoRequest>();
  @Output() cancel = new EventEmitter<void>();

  formData = signal<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    completed: false
  });

  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const currentTodo = this.todo();
      const isShowing = this.show();


      if (currentTodo && isShowing) {
        this.initializeForm();
      }
    });
  }

  private initializeForm(): void {
    const currentTodo = this.todo();
    if (currentTodo) {
      this.formData.set({
        title: currentTodo.title,
        description: currentTodo.description || '',
        priority: currentTodo.priority,
        completed: currentTodo.completed
      });
    }
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

  updateCompleted(value: boolean): void {
    this.formData.update(data => ({ ...data, completed: value }));
  }

  onSubmit(): void {
    const currentData = this.formData();
    const currentTodo = this.todo();

    if (currentData.title.trim() && currentTodo) {
      this.isSubmitting.set(true);
      this.save.emit({
        id: currentTodo.id,
        title: currentData.title.trim(),
        description: currentData.description?.trim() || '',
        priority: currentData.priority,
        completed: currentData.completed
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
