export interface ProjectTech {
  name: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  githubUrl: string;
  liveUrl?: string;
  techStack: ProjectTech[];
} 