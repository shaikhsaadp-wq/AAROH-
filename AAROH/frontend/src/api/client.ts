// AAROH AI — API Client
// All communication with the FastAPI backend goes through this module.

import type {
  Agent,
  Department,
  Project,
  Task,
  CommandResponse,
  HealthResponse,
} from '../types'

const BASE_URL = '/api'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.detail ?? err.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── Health ──────────────────────────────────────────────────────────────────
export const getHealth = () => fetchJson<HealthResponse>('/health')

// ─── Agents ──────────────────────────────────────────────────────────────────
export const getAgents = (params?: { department_id?: string; agent_status?: string }) => {
  const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString()
  return fetchJson<Agent[]>(`/agents${qs ? `?${qs}` : ''}`)
}

export const getAgent = (id: string) => fetchJson<Agent>(`/agents/${id}`)

export const updateAgent = (id: string, patch: Partial<Agent>) =>
  fetchJson<Agent>(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })

// ─── Departments ─────────────────────────────────────────────────────────────
export const getDepartments = () => fetchJson<Department[]>('/departments')
export const getDepartment = (id: string) => fetchJson<Department>(`/departments/${id}`)

// ─── Projects ────────────────────────────────────────────────────────────────
export const getProjects = () => fetchJson<Project[]>('/projects')

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const getTasks = (projectId?: string) =>
  fetchJson<Task[]>(`/tasks${projectId ? `?project_id=${projectId}` : ''}`)

export const updateTask = (id: string, patch: Partial<Task>) =>
  fetchJson<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })

// ─── Commands ────────────────────────────────────────────────────────────────
export const sendCommand = (
  command: string,
  options?: { target_agent_id?: string; target_department_id?: string }
) =>
  fetchJson<CommandResponse>('/commands', {
    method: 'POST',
    body: JSON.stringify({ command, ...options }),
  })

