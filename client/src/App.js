import React, { useEffect, useState } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api';
import {
  Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton, CircularProgress, Snackbar, Alert, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoForm({ onAdd, loading }) {
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !shortDescription || !dateTime) {
      setError('All fields are required');
      return;
    }
    try {
      await onAdd({ name, shortDescription, dateTime });
      setName('');
      setShortDescription('');
      setDateTime('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add todo');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        size="small"
      />
      <TextField
        label="Short Description"
        value={shortDescription}
        onChange={e => setShortDescription(e.target.value)}
        required
        size="small"
      />
      <TextField
        label="Date & Time"
        type="datetime-local"
        value={dateTime}
        onChange={e => setDateTime(e.target.value)}
        required
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Add Todo'}
      </Button>
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
    </Box>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchTodos = async (filterValue = filter) => {
    setLoading(true);
    try {
      const res = await getTodos(filterValue === 'all' ? undefined : filterValue);
      setTodos(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch todos', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, [filter]);

  const handleAdd = async (data) => {
    setFormLoading(true);
    await addTodo(data);
    setFormLoading(false);
    fetchTodos();
    setSnackbar({ open: true, message: 'Todo added!', severity: 'success' });
  };

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, { isDone: !todo.isDone });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
    setSnackbar({ open: true, message: 'Todo deleted!', severity: 'info' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Todo App</Typography>
      <TodoForm onAdd={handleAdd} loading={formLoading} />
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => setFilter(val || 'all')}
          aria-label="filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="done">Done</ToggleButton>
          <ToggleButton value="upcoming">Upcoming</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {todos.map(todo => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ bgcolor: todo.isDone ? 'action.selected' : 'background.paper', mb: 1, borderRadius: 1 }}
            >
              <Checkbox
                checked={todo.isDone}
                onChange={() => handleToggle(todo)}
                inputProps={{ 'aria-label': 'Mark as done' }}
              />
              <ListItemText
                primary={todo.name}
                secondary={<>
                  {todo.shortDescription}<br />
                  {new Date(todo.dateTime).toLocaleString()}
                </>}
                sx={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App; 