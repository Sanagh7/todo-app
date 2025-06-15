import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, CircularProgress, Snackbar, Alert, 
  CssBaseline, AppBar, Toolbar, IconButton, useMediaQuery, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  useTheme, ThemeProvider, createTheme, PaletteMode
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  TaskAlt as TaskIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getTodos, addTodo, updateTodo, deleteTodo, getCategories, Todo, TodoCreate, TodoFilter, TodoUpdate } from './api';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoEditDialog from './components/TodoEditDialog';
import TodoFilters from './components/TodoFilters';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['General']);
  const [filters, setFilters] = useState<TodoFilter>({ filter: 'all' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [mode, setMode] = useState<PaletteMode>('light');
  
  // Responsive drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Create a customized theme
  const customTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }
        }
      }
    }
  });

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await getTodos(filters);
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setSnackbar({ open: true, message: 'Failed to fetch tasks', severity: 'error' });
    }
    setLoading(false);
  };
  
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    // Load the preferred theme mode from localStorage
    const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    }
    
    fetchTodos();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Effect to update todos when filters change
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  
  // Effect to check for overdue tasks and notify user
  useEffect(() => {
    const overdueTasks = todos.filter(todo => 
      !todo.isDone && new Date(todo.dateTime) < new Date()
    );
    
    if (overdueTasks.length > 0) {
      const tasksText = overdueTasks.length === 1 
        ? '1 task is' 
        : `${overdueTasks.length} tasks are`;
      
      setSnackbar({ 
        open: true, 
        message: `${tasksText} overdue!`, 
        severity: 'error' 
      });
    }
  }, [todos]);

  const handleAdd = async (data: TodoCreate) => {
    setFormLoading(true);
    try {
      await addTodo(data);
      fetchTodos();
      fetchCategories(); // Refresh categories in case a new one was added
      setSnackbar({ open: true, message: 'Task added successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add task', severity: 'error' });
    }
    setFormLoading(false);
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      fetchTodos();
      setSnackbar({ 
        open: true, 
        message: todo.isDone ? 'Task marked as incomplete' : 'Task marked as complete', 
        severity: 'info' 
      });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update task status', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      fetchTodos();
      setSnackbar({ open: true, message: 'Task deleted!', severity: 'info' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
  };
  
  const handleEdit = async (id: number, data: TodoUpdate) => {
    try {
      await updateTodo(id, data);
      fetchTodos();
      fetchCategories(); // Refresh categories in case a new one was added
      setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update task', severity: 'error' });
    }
  };
  
  const toggleThemeMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Advanced Todo App
            </Typography>
            <IconButton color="inherit" onClick={toggleThemeMode}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {!isMobile && (
            <Box
              component="nav"
              sx={{ width: 240, flexShrink: 0 }}
            >
              <Box sx={{ width: 240, position: 'fixed', height: '100%', borderRight: 1, borderColor: 'divider' }}>
                <List>
                  <ListItemButton selected>
                    <ListItemIcon>
                      <TaskIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tasks" />
                  </ListItemButton>
                </List>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                  <List dense>
                    {categories.map(category => (
                      <ListItemButton 
                        key={category}
                        dense
                        onClick={() => setFilters({ ...filters, category })}
                        selected={filters.category === category}
                      >
                        <ListItemText primary={category} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Mobile drawer */}
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 240 }}>
              <List>
                <ListItemButton onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon>
                    <TaskIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                </ListItemButton>
              </List>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
                <List dense>
                  {categories.map(category => (
                    <ListItemButton 
                      key={category}
                      dense
                      onClick={() => {
                        setFilters({ ...filters, category });
                        setDrawerOpen(false);
                      }}
                      selected={filters.category === category}
                    >
                      <ListItemText primary={category} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Box>
          </Drawer>
          
          <Container component="main" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
            <TodoForm 
              onAdd={handleAdd} 
              loading={formLoading} 
              categories={categories} 
            />
            
            <TodoFilters 
              onFilterChange={setFilters} 
              categories={categories}
            />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {todos.length === 0 ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mt: 4,
                      p: 4,
                      bgcolor: 'background.paper',
                      borderRadius: 2
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      No tasks found
                    </Typography>
                    <Typography color="text.secondary" align="center">
                      Try adjusting your filters or create a new task
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {todos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={() => setEditTodo(todo)}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Box>
        
        <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            Advanced Todo App © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
      
      <TodoEditDialog
        open={!!editTodo}
        onClose={() => setEditTodo(null)}
        todo={editTodo}
        onSave={handleEdit}
        categories={categories}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App; 