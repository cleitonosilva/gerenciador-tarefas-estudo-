import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Post } from '../../services/api.service';
import { CreateTodoRequest } from '../../models/todo.model';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';

interface PostWithPriority extends Post {
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-import-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityBadgeComponent],
  templateUrl: './import-posts.component.html',
  styleUrls: ['./import-posts.component.scss']
})
export class ImportPostsComponent {
  @Output() importTodo = new EventEmitter<CreateTodoRequest>();
  @Output() postRemoved = new EventEmitter<number>();

  posts = signal<PostWithPriority[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedPosts = signal<number[]>([]);

  currentPage = signal(1);
  postsPerPage = signal(5);
  totalPosts = signal(0);

  constructor(private apiService: ApiService) {}

    loadPosts(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    const start = (page - 1) * this.postsPerPage();
    const end = start + this.postsPerPage();

    this.apiService.getPosts().subscribe({
      next: (allPosts) => {
        this.totalPosts.set(allPosts.length);

        const pagePosts = allPosts.slice(start, end);

        const postsWithPriority: PostWithPriority[] = pagePosts.map(post => ({
          ...post,
          priority: 'medium' as const
        }));

        this.posts.set(postsWithPriority);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Erro ao carregar posts da API');
        this.loading.set(false);
        console.error('Error loading posts:', error);
      }
    });
  }

  updatePostPriority(postId: number, priority: 'low' | 'medium' | 'high'): void {
    this.posts.update(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, priority } : post
      )
    );
  }

  togglePostSelection(postId: number): void {
    const current = this.selectedPosts();
    if (current.includes(postId)) {
      this.selectedPosts.set(current.filter(id => id !== postId));
    } else {
      this.selectedPosts.set([...current, postId]);
    }
  }

  importSelectedPosts(): void {
    const selected = this.selectedPosts();
    const posts = this.posts();

    selected.forEach(postId => {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const todoRequest: CreateTodoRequest = {
          title: post.title,
          description: post.body.substring(0, 100) + (post.body.length > 100 ? '...' : ''),
          priority: post.priority
        };
        this.importTodo.emit(todoRequest);
      }
    });

    this.selectedPosts.set([]);
  }

  selectAll(): void {
    const allIds = this.posts().map(p => p.id);
    this.selectedPosts.set(allIds);
  }

  deselectAll(): void {
    this.selectedPosts.set([]);
  }

  getSelectedCount(): number {
    return this.selectedPosts().length;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalPosts() / this.postsPerPage());
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.loadPosts(page);
    }
  }

  nextPage(): void {
    const next = this.currentPage() + 1;
    if (next <= this.getTotalPages()) {
      this.goToPage(next);
    }
  }

  previousPage(): void {
    const prev = this.currentPage() - 1;
    if (prev >= 1) {
      this.goToPage(prev);
    }
  }

  canGoNext(): boolean {
    return this.currentPage() < this.getTotalPages();
  }

  canGoPrevious(): boolean {
    return this.currentPage() > 1;
  }

    onDragStart(event: DragEvent, post: PostWithPriority): void {
    if (event.dataTransfer) {
      const todoRequest: CreateTodoRequest = {
        title: post.title,
        description: post.body.substring(0, 100) + (post.body.length > 100 ? '...' : ''),
        priority: post.priority
      };

      event.dataTransfer.setData('application/json', JSON.stringify(todoRequest));
      event.dataTransfer.setData('text/plain', post.id.toString());
      event.dataTransfer.effectAllowed = 'copy';

      const target = event.target as HTMLElement;
      if (target) {
        target.classList.add('dragging');
      }
    }
  }

  onDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.classList.remove('dragging');
    }
  }

    removePost(postId: number): void {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`) as HTMLElement;
    if (postElement) {
      postElement.classList.add('removing');

      setTimeout(() => {
        this.posts.update(posts => posts.filter(post => post.id !== postId));
        this.selectedPosts.update(selected => selected.filter(id => id !== postId));
        this.totalPosts.update(total => total - 1);
        this.postRemoved.emit(postId);
      }, 300);
    } else {
      this.posts.update(posts => posts.filter(post => post.id !== postId));
      this.selectedPosts.update(selected => selected.filter(id => id !== postId));
      this.totalPosts.update(total => total - 1);
      this.postRemoved.emit(postId);
    }
  }
}
