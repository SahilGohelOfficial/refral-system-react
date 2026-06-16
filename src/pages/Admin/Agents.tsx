import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  KeyRound,
  UserX,
  UserCheck,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import {
  createAgent,
  deleteAgent,
  listAgents,
  resetAgentPassword,
  updateAgent,
  updateAgentStatus,
} from '../../services/agents.service';
import { formatApiError } from '../../lib/api';
import type { Agent, AgentCredentials, ApiError } from '../../types/api';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [credentials, setCredentials] = useState<AgentCredentials | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAgents();
      setAgents(data);
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
  };

  const openCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEdit = (agent: Agent) => {
    setFormName(agent.name);
    setFormEmail(agent.email ?? '');
    setFormPhone(agent.phone ?? '');
    setEditingAgent(agent);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createAgent({
        name: formName,
        email: formEmail || undefined,
        phone: formPhone || undefined,
      });
      toast.success('Agent created successfully');
      setIsCreateOpen(false);
      setCredentials(result.credentials);
      resetForm();
      await fetchAgents();
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setSubmitting(true);
    try {
      await updateAgent(editingAgent.id, {
        name: formName,
        email: formEmail || undefined,
        phone: formPhone || undefined,
      });
      toast.success('Agent updated successfully');
      setEditingAgent(null);
      resetForm();
      await fetchAgents();
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    try {
      await updateAgentStatus(agent.id, !agent.isActive);
      toast.success(agent.isActive ? 'Agent deactivated' : 'Agent activated');
      await fetchAgents();
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    }
  };

  const handleResetPassword = async (agent: Agent) => {
    try {
      const result = await resetAgentPassword(agent.id);
      setCredentials(result.credentials);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    }
  };

  const handleDelete = async (agent: Agent) => {
    if (!window.confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAgent(agent.id);
      toast.success('Agent deleted successfully');
      await fetchAgents();
    } catch (error) {
      toast.error(formatApiError(error as ApiError));
    }
  };

  const copyCredentials = async (creds: AgentCredentials) => {
    const text = `Login ID: ${creds.agentLoginId}\nPassword: ${creds.password}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Credentials copied to clipboard');
    } catch {
      toast.error('Failed to copy credentials');
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const query = search.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.agentLoginId.toLowerCase().includes(query) ||
      (agent.email?.toLowerCase().includes(query) ?? false)
    );
  });

  const agentForm = (onSubmit: (e: FormEvent) => void, submitLabel: string) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        required
        disabled={submitting}
      />
      <Input
        label="Email"
        type="email"
        value={formEmail}
        onChange={(e) => setFormEmail(e.target.value)}
        disabled={submitting}
      />
      <Input
        label="Phone"
        value={formPhone}
        onChange={(e) => setFormPhone(e.target.value)}
        disabled={submitting}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingAgent(null);
            resetForm();
          }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Agent Management</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage partner agents and their accounts.
          </p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openCreate}>
          <Plus size={16} />
          Add New Agent
        </Button>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/50 rounded-t-[20px]">
          <div className="w-full sm:w-96">
            <Input
              icon={Search}
              placeholder="Search by name, login ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            {search ? 'No agents match your search.' : 'No agents yet. Create your first agent.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text">{agent.name}</div>
                        <div className="text-xs text-text-secondary">
                          {agent.email ?? 'No email'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{agent.agentLoginId}</span>
                  </TableCell>
                  <TableCell>{agent.phone ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={agent.isActive ? 'success' : 'neutral'}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-1 text-text-secondary hover:text-text hover:bg-surface rounded-md transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => openEdit(agent)}>
                        <Edit2 size={14} /> Edit Agent
                      </DropdownItem>
                      <DropdownItem onClick={() => handleResetPassword(agent)}>
                        <KeyRound size={14} /> Reset Password
                      </DropdownItem>
                      <DropdownItem onClick={() => handleToggleStatus(agent)}>
                        {agent.isActive ? (
                          <>
                            <UserX size={14} /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} /> Activate
                          </>
                        )}
                      </DropdownItem>
                      <DropdownItem danger onClick={() => handleDelete(agent)}>
                        <Trash2 size={14} /> Delete
                      </DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Agent">
        {agentForm(handleCreate, 'Create Agent')}
      </Modal>

      <Modal
        isOpen={!!editingAgent}
        onClose={() => {
          setEditingAgent(null);
          resetForm();
        }}
        title="Edit Agent"
      >
        {agentForm(handleUpdate, 'Save Changes')}
      </Modal>

      <Modal
        isOpen={!!credentials}
        onClose={() => setCredentials(null)}
        title="Agent Credentials"
        maxWidth="lg"
      >
        {credentials && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Save these credentials now. The password cannot be retrieved later.
            </p>
            <div className="rounded-lg border border-border bg-surface p-4 space-y-3 font-mono text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-text-secondary">Login ID</span>
                <span className="text-text">{credentials.agentLoginId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-secondary">Password</span>
                <span className="text-text">{credentials.password}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => copyCredentials(credentials)}
              >
                <Copy size={16} />
                Copy
              </Button>
              <Button onClick={() => setCredentials(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Agents;
