// AAROH AI — Global Zustand Store

import { create } from 'zustand'
import type { Agent, Department, Project, Task, CommandResponse, Notification } from '../types'
import * as api from '../api/client'

interface AppState {
  // Data
  agents: Agent[]
  departments: Department[]
  projects: Project[]
  tasks: Task[]
  commands: CommandResponse[]
  notifications: Notification[]

  // UI State
  selectedAgentId: string | null
  selectedDepartmentId: string | null
  isCommandPanelOpen: boolean
  isLoading: boolean
  error: string | null
  backendOnline: boolean

  // Actions
  loadAll: () => Promise<void>
  selectAgent: (id: string | null) => void
  selectDepartment: (id: string | null) => void
  toggleCommandPanel: () => void
  sendCommand: (cmd: string) => Promise<void>
  pushNotification: (n: Omit<Notification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
  updateAgentStatus: (agentId: string, status: Agent['status'], activity?: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  agents: [],
  departments: [],
  projects: [],
  tasks: [],
  commands: [],
  notifications: [],
  selectedAgentId: null,
  selectedDepartmentId: null,
  isCommandPanelOpen: false,
  isLoading: false,
  error: null,
  backendOnline: false,

  loadAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const [agents, departments, projects, tasks] = await Promise.all([
        api.getAgents(),
        api.getDepartments(),
        api.getProjects(),
        api.getTasks(),
      ])
      set({ agents, departments, projects, tasks, backendOnline: true, isLoading: false })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data'
      set({ error: msg, backendOnline: false, isLoading: false })
      get().pushNotification({ type: 'error', title: 'Connection Error', message: msg })
    }
  },

  selectAgent: (id) => set({ selectedAgentId: id, selectedDepartmentId: null }),
  selectDepartment: (id) => set({ selectedDepartmentId: id, selectedAgentId: null }),
  toggleCommandPanel: () => set((s) => ({ isCommandPanelOpen: !s.isCommandPanelOpen })),

  sendCommand: async (cmd) => {
    try {
      const response = await api.sendCommand(cmd)
      set((s) => ({ commands: [response, ...s.commands] }))
      get().pushNotification({
        type: 'info',
        title: 'Command sent',
        message: response.response.substring(0, 80) + '…',
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Command failed'
      get().pushNotification({ type: 'error', title: 'Command Error', message: msg })
    }
  },

  pushNotification: (n) => {
    const notification: Notification = {
      ...n,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    set((s) => ({ notifications: [notification, ...s.notifications.slice(0, 9)] }))
    setTimeout(() => get().dismissNotification(notification.id), 5000)
  },

  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  updateAgentStatus: async (agentId, status, activity) => {
    try {
      const patch: Partial<Agent> = { status }
      if (activity) patch.current_activity = activity
      const updated = await api.updateAgent(agentId, patch)
      set((s) => ({
        agents: s.agents.map((a) => (a.id === agentId ? updated : a)),
      }))
    } catch (err) {
      get().pushNotification({ type: 'error', title: 'Update Failed', message: String(err) })
    }
  },
}))

