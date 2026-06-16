import { api } from '../lib/api';
import type {
  Agent,
  CreateAgentPayload,
  CreateAgentResponse,
  MessageResponse,
  ResetAgentPasswordResponse,
  UpdateAgentPayload,
} from '../types/api';

export function listAgents() {
  return api<Agent[]>('/agents');
}

export function getAgent(id: string) {
  return api<Agent>(`/agents/${id}`);
}

export function createAgent(payload: CreateAgentPayload) {
  return api<CreateAgentResponse>('/agents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAgent(id: string, payload: UpdateAgentPayload) {
  return api<Agent>(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteAgent(id: string) {
  return api<MessageResponse>(`/agents/${id}`, { method: 'DELETE' });
}

export function updateAgentStatus(id: string, isActive: boolean) {
  return api<Agent>(`/agents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export function resetAgentPassword(id: string) {
  return api<ResetAgentPasswordResponse>(`/agents/${id}/reset-password`, {
    method: 'PATCH',
  });
}
