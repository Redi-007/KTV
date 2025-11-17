import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [users, setUsers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 0,
    workflowId: '',
    currentStepId: '',
    assignedToUserId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, workflowsData, usersData, labelsData] = await Promise.all([
        api.getTasks(),
        api.getWorkflows(),
        api.getUsers(),
        api.getLabels(),
      ]);
      setTasks(tasksData);
      setWorkflows(workflowsData);
      setUsers(usersData);
      setLabels(labelsData);
      
      if (workflowsData.length > 0) {
        setSelectedWorkflow(workflowsData[0].id);
        setWorkflowSteps(workflowsData[0].steps || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowChange = (workflowId) => {
    setSelectedWorkflow(parseInt(workflowId));
    const workflow = workflows.find(w => w.id === parseInt(workflowId));
    setWorkflowSteps(workflow?.steps || []);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        workflowId: parseInt(newTask.workflowId),
        currentStepId: newTask.currentStepId ? parseInt(newTask.currentStepId) : null,
        assignedToUserId: newTask.assignedToUserId ? parseInt(newTask.assignedToUserId) : null,
        labelIds: [],
      };
      await api.createTask(taskData);
      setNewTask({
        title: '',
        description: '',
        priority: 0,
        workflowId: '',
        currentStepId: '',
        assignedToUserId: '',
      });
      setShowTaskForm(false);
      await loadData();
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  const handleMoveTask = async (taskId, toStepId) => {
    try {
      await api.moveTask(taskId, { toStepId });
      await loadData();
    } catch (err) {
      alert('Error moving task: ' + err.message);
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await api.assignTask(taskId, { assignedToUserId: userId ? parseInt(userId) : null });
      await loadData();
    } catch (err) {
      alert('Error assigning task: ' + err.message);
    }
  };

  const getTasksByStep = (stepId) => {
    return tasks.filter(task => 
      task.workflowId === selectedWorkflow && 
      task.currentStepId === stepId
    );
  };

  if (loading) {
    return <div className="container"><h2>Loading...</h2></div>;
  }

  if (error) {
    return <div className="container"><h2>Error: {error}</h2></div>;
  }

  return (
    <div className="container">
      <h1>KTV Workflow Manager</h1>
      
      <div className="toolbar">
        <div className="workflow-selector">
          <label>Workflow: </label>
          <select 
            value={selectedWorkflow || ''} 
            onChange={(e) => handleWorkflowChange(e.target.value)}
          >
            <option value="">Select a workflow</option>
            {workflows.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        
        <button onClick={() => setShowTaskForm(!showTaskForm)}>
          {showTaskForm ? 'Cancel' : 'Create New Task'}
        </button>
      </div>

      {showTaskForm && (
        <div className="task-form">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
            <select
              value={newTask.workflowId}
              onChange={(e) => {
                setNewTask({...newTask, workflowId: e.target.value});
                const workflow = workflows.find(w => w.id === parseInt(e.target.value));
                setWorkflowSteps(workflow?.steps || []);
              }}
              required
            >
              <option value="">Select Workflow</option>
              {workflows.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <select
              value={newTask.currentStepId}
              onChange={(e) => setNewTask({...newTask, currentStepId: e.target.value})}
            >
              <option value="">Select Step (optional)</option>
              {workflowSteps.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={newTask.assignedToUserId}
              onChange={(e) => setNewTask({...newTask, assignedToUserId: e.target.value})}
            >
              <option value="">Assign to User (optional)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <button type="submit">Create Task</button>
          </form>
        </div>
      )}

      {selectedWorkflow && (
        <div className="kanban-board">
          {workflowSteps.map(step => (
            <div key={step.id} className="kanban-column">
              <h3>{step.name}</h3>
              <div className="tasks-list">
                {getTasksByStep(step.id).map(task => (
                  <div key={task.id} className="task-card">
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    {task.assignedToUserName && (
                      <p className="assignee">👤 {task.assignedToUserName}</p>
                    )}
                    <div className="task-actions">
                      <select
                        onChange={(e) => handleMoveTask(task.id, parseInt(e.target.value))}
                        value=""
                      >
                        <option value="">Move to...</option>
                        {workflowSteps.filter(s => s.id !== step.id).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <select
                        onChange={(e) => handleAssignTask(task.id, e.target.value)}
                        value={task.assignedToUserId || ''}
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
