// AAROH AI — Shared TypeScript Types

export type AgentStatus = 'idle' | 'working' | 'meeting' | 'completed' | 'offline'

export interface Agent {
  id: string
  name: string
  role: string
  department_id: string
  department: string
  avatar_color: string
  avatar_shape: string
  status: AgentStatus
  current_activity: string
  capabilities: string[]
  workstation: { x: number; y: number; z: number }
  is_simulated: boolean
  simulation_note: string
  tasks_completed: number
  tasks_in_progress: number
  created_at: string
  updated_at?: string
}

export interface Department {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  location: { x: number; y: number; z: number }
  headcount: number
  status: string
}

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  phase: string
  tech_stack: string[]
  assigned_agents: string[]
  created_at: string
  updated_at: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  project_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigned_agent_id?: string
  created_at: string
  updated_at: string
}

export interface CommandResponse {
  id: string
  command: string
  response: string
  provider: string
  is_simulated: boolean
  target_agent_id?: string
  target_department_id?: string
  timestamp: string
}

export interface HealthResponse {
  status: string
  version: string
  environment: string
  ai_provider: string
  is_simulated: boolean
  timestamp: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
}

