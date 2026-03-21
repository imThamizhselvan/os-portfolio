import { Component } from '@angular/core';
import { SKILLS_DATA, Skill } from '../../../core/models/skill.model';

@Component({
  selector: 'app-about-app',
  imports: [],
  templateUrl: './about-app.html',
  styleUrl: './about-app.scss'
})
export class AboutAppComponent {
  readonly categories: Skill['category'][] = ['frontend', 'mobile', 'backend', 'devops', 'ai'];
  readonly skills = SKILLS_DATA;

  skillsByCategory(cat: Skill['category']): Skill[] {
    return this.skills.filter(s => s.category === cat).sort((a, b) => b.level - a.level);
  }

  catLabel(cat: string): string {
    const m: Record<string, string> = { frontend:'Frontend', mobile:'Mobile', backend:'Backend / Cloud', devops:'DevOps', ai:'AI & Tools' };
    return m[cat] ?? cat;
  }

  catColor(cat: string): string {
    const m: Record<string, string> = { frontend:'#e95420', mobile:'#3584e4', backend:'#1a9f4a', devops:'#c061cb', ai:'#ff7800' };
    return m[cat] ?? '#888';
  }
}
