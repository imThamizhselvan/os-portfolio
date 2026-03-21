import { Component } from '@angular/core';
import { SKILLS_DATA, Skill } from '../../../core/models/skill.model';

@Component({
  selector: 'app-resume-app',
  imports: [],
  templateUrl: './resume-app.html',
  styleUrl: './resume-app.scss'
})
export class ResumeAppComponent {
  readonly experience = [
    { role: 'Senior Full-Stack Developer', company: 'Freelance / Self-employed', period: '2020 – Present',
      points: ['Built 10+ production apps with React, Angular, Node.js, AWS', 'Integrated AI (OpenAI, Claude APIs) into client products', 'Deployed cloud infrastructure on AWS Lambda, S3, CloudFront'] },
    { role: 'Mobile Developer', company: 'Tech Startup, Australia', period: '2017 – 2020',
      points: ['Led React Native development for iOS & Android', 'Built CI/CD pipelines with Jenkins & Fastlane', 'Mentored junior developers and led sprint planning'] },
  ];

  top(cat: Skill['category'], n = 5): Skill[] {
    return SKILLS_DATA.filter(s => s.category === cat).sort((a,b) => b.level - a.level).slice(0, n);
  }
}
