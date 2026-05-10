import * as fs from 'node:fs'
import * as path from 'node:path'
import yaml from 'js-yaml'
import type { ProjectItem } from '@/interface/project'

const projectsPath = path.resolve('src/data/projects.yaml')

export function loadProjects(): ProjectItem[] {
  try {
    const content = fs.readFileSync(projectsPath, 'utf8')
    const data = yaml.load(content)
    if (Array.isArray(data)) {
      return data as ProjectItem[]
    }
    return []
  } catch {
    return []
  }
}
