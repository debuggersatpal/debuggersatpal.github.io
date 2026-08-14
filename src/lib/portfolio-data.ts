import { db } from './firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import type { Project } from '../data/projects';

// Normalized data fetchers for the public site
// These fetch published content only and sort appropriately

export async function getPublishedProjects(): Promise<Project[]> {
  const projectsRef = query(ref(db, 'projects'), orderByChild('published'), equalTo(true));
  const snapshot = await get(projectsRef);
  const projects: Project[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      projects.push(child.val() as Project);
    });
  }
  
  return projects.sort((a, b) => (a as any).order - (b as any).order);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snapshot = await get(ref(db, `projects/${id}`));
  if (snapshot.exists()) {
    return snapshot.val() as Project;
  }
  return null;
}

export async function getPublishedExperience(): Promise<any[]> {
  const expRef = query(ref(db, 'experience'), orderByChild('published'), equalTo(true));
  const snapshot = await get(expRef);
  const exps: any[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      exps.push(child.val());
    });
  }
  
  return exps.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getPublishedSkills(): Promise<any[]> {
  const skillsRef = query(ref(db, 'skills'), orderByChild('published'), equalTo(true));
  const snapshot = await get(skillsRef);
  const skills: any[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      skills.push(child.val());
    });
  }
  
  return skills.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getAbout(): Promise<any> {
  const snapshot = await get(ref(db, 'about'));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function getContact(): Promise<any> {
  const snapshot = await get(ref(db, 'contact'));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function getSettings(): Promise<any> {
  const snapshot = await get(ref(db, 'settings'));
  return snapshot.exists() ? snapshot.val() : null;
}
