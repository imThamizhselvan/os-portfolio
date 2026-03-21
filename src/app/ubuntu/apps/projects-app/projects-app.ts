import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects-app',
  imports: [],
  templateUrl: './projects-app.html',
  styleUrl: './projects-app.scss'
})
export class ProjectsAppComponent {
  private ps = inject(ProjectService);
  readonly projects = this.ps.getProjects();
  readonly lightbox = signal<{ src: string; title: string } | null>(null);

  logo(tech: string): string { return this.ps.getTechLogo(tech); }
}
