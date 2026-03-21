import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { BlogArticle } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-app',
  imports: [DatePipe],
  templateUrl: './blog-app.html',
  styleUrl: './blog-app.scss'
})
export class BlogAppComponent implements OnInit {
  private svc = inject(BlogService);
  articles  = signal<BlogArticle[]>([]);
  selected  = signal<BlogArticle | null>(null);
  loading   = signal(true);

  ngOnInit(): void {
    this.svc.getArticles().subscribe({ next: a => { this.articles.set(a); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
}
