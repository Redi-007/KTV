const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },
  getUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },
  createUser: async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },
  updateUser: async (id, user) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response;
  },
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // Tasks
  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    return response.json();
  },
  getTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return response.json();
  },
  createTask: async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return response.json();
  },
  updateTask: async (id, task) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return response;
  },
  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
  moveTask: async (id, moveData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moveData),
    });
    return response.json();
  },
  assignTask: async (id, assignData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignData),
    });
    return response.json();
  },
  getTaskHistory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/history`);
    return response.json();
  },

  // Workflows
  getWorkflows: async () => {
    const response = await fetch(`${API_BASE_URL}/workflows`);
    return response.json();
  },
  getWorkflow: async (id) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`);
    return response.json();
  },
  createWorkflow: async (workflow) => {
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });
    return response.json();
  },
  updateWorkflow: async (id, workflow) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });
    return response;
  },
  deleteWorkflow: async (id) => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // WorkflowSteps
  getWorkflowSteps: async () => {
    const response = await fetch(`${API_BASE_URL}/workflowsteps`);
    return response.json();
  },
  createWorkflowStep: async (step) => {
    const response = await fetch(`${API_BASE_URL}/workflowsteps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(step),
    });
    return response.json();
  },

  // Labels
  getLabels: async () => {
    const response = await fetch(`${API_BASE_URL}/labels`);
    return response.json();
  },
  createLabel: async (label) => {
    const response = await fetch(`${API_BASE_URL}/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label),
    });
    return response.json();
  },

  // Institutions
  getInstitutions: async () => {
    const response = await fetch(`${API_BASE_URL}/institutions`);
    return response.json();
  },
  createInstitution: async (institution) => {
    const response = await fetch(`${API_BASE_URL}/institutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institution),
    });
    return response.json();
  },

  // Roles
  getRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/roles`);
    return response.json();
  },
  createRole: async (role) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    return response.json();
  },
};
