export type AdminRole = 'superAdmin' | 'admin';

export type PortalRole = 'admin' | 'superAdmin' | 'agent' | 'withdrawal';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  agentLoginId: string;
  name: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentCredentials {
  agentLoginId: string;
  password: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: Admin;
}

export interface AgentLoginResponse {
  accessToken: string;
  agent: Agent;
}

export interface MessageResponse {
  message: string;
}

export interface CreateAgentResponse {
  agent: Agent;
  credentials: AgentCredentials;
}

export interface ResetAgentPasswordResponse {
  message: string;
  credentials: AgentCredentials;
}

export interface CreateAgentPayload {
  name: string;
  phone?: string;
  email?: string;
}

export interface UpdateAgentPayload {
  name?: string;
  phone?: string;
  email?: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  role?: AdminRole;
}
