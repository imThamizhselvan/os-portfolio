export type AppId = 'about' | 'projects' | 'resume' | 'contact' | 'blog' | 'chrome' | 'calculator';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  iconSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevX?: number;
  prevY?: number;
  prevWidth?: number;
  prevHeight?: number;
}

export const APP_CONFIG: Record<AppId, { title: string; iconSrc: string; width: number; height: number }> = {
  about:      { title: 'About Me',    iconSrc: 'assets/ubuntu/icons/about.svg',      width: 720, height: 540 },
  projects:   { title: 'My Projects', iconSrc: 'assets/ubuntu/icons/projects.svg',   width: 860, height: 600 },
  resume:     { title: 'Resume',      iconSrc: 'assets/ubuntu/icons/resume.svg',     width: 680, height: 540 },
  contact:    { title: 'Contact',     iconSrc: 'assets/ubuntu/icons/contact.svg',    width: 620, height: 500 },
  blog:       { title: 'Blog',        iconSrc: 'assets/ubuntu/icons/blog.svg',       width: 780, height: 580 },
  chrome:     { title: 'Chromium',    iconSrc: 'assets/ubuntu/icons/chrome.svg',     width: 900, height: 640 },
  calculator: { title: 'Calculator',  iconSrc: 'assets/ubuntu/icons/calculator.svg', width: 320, height: 480 },
};

export const LAUNCHER_APPS: { appId: AppId; label: string }[] = [
  { appId: 'about',      label: 'About Me'    },
  { appId: 'projects',   label: 'My Projects' },
  { appId: 'resume',     label: 'Resume'      },
  { appId: 'contact',    label: 'Contact'     },
  { appId: 'blog',       label: 'Blog'        },
  { appId: 'chrome',     label: 'Chromium'    },
  { appId: 'calculator', label: 'Calculator'  },
];
