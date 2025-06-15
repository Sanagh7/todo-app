import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, CircularProgress, Snackbar, Alert, 
  CssBaseline, AppBar, Toolbar, IconButton, useMediaQuery, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  useTheme, ThemeProvider, createTheme, PaletteMode, Badge, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  TaskAlt as TaskIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  FilterList as FilterListIcon,
  Dashboard as DashboardIcon
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
  const [showFilters, setShowFilters] = useState(true);
  
  // Responsive drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculate statistics for dashboard
  const overdueCount = todos.filter(todo => !todo.isDone && new Date(todo.dateTime) < new Date()).length;
  const completedCount = todos.filter(todo => todo.isDone).length;
  const upcomingCount = todos.filter(todo => !todo.isDone && new Date(todo.dateTime) > new Date()).length;
  const totalCount = todos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Drawer width calculation
  const drawerWidth = 240;

  // Drawer content - defined early to be used in both mobile and desktop drawers
  const drawerContent = (
    <>
      <Toolbar /> {/* Spacer to push content below app bar */}
      <List sx={{ mt: 2 }}>
        <ListItemButton 
          selected
          sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        
        <ListItemButton
          sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}
          onClick={() => setFilters({ filter: 'all' })}
          selected={!filters.category && filters.filter === 'all'}
        >
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="All Tasks" />
        </ListItemButton>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ px: 2 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          fontWeight="bold"
          sx={{ px: 2, mb: 1 }}
        >
          CATEGORIES
        </Typography>
        
        <List dense>
          {categories.map(category => (
            <ListItemButton 
              key={category}
              sx={{ 
                borderRadius: '0 20px 20px 0', 
                pl: 3,
                minHeight: 36
              }}
              selected={filters.category === category}
              onClick={() => setFilters({ ...filters, category })}
            >
              <ListItemText 
                primary={category} 
                primaryTypographyProps={{ 
                  fontSize: '0.875rem',
                  fontWeight: filters.category === category ? 'bold' : 'normal' 
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.default', 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2">
            Completion Rate
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {completionRate}%
          </Typography>
        </Box>
      </Box>
    </>
  );

  // Create a customized theme
  const customTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#e91e63',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f7f9fc',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            },
            boxShadow: mode === 'dark' 
              ? '0 4px 8px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0,0,0,0.08)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          }
        }
      }
    }
  });

  const [databaseError, setDatabaseError] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      console.log("Fetching todos with filters:", filters);
      const res = await getTodos(filters);
      console.log("Todos fetched:", res.data.length);
      setTodos(res.data);
      // Clear any previous error states
      setDatabaseError(false);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setSnackbar({ open: true, message: 'Failed to fetch tasks', severity: 'error' });
      setDatabaseError(true);
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
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme => theme.zIndex.drawer + 1,
            boxShadow: theme => theme.shadows[4]
          }}
          color="default"
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TaskIcon /> Advanced Todo App
            </Typography>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                color={showFilters ? 'primary' : 'default'}
                onClick={() => setShowFilters(!showFilters)}
                title="Toggle Filters"
              >
                <FilterListIcon />
              </IconButton>
              
              <IconButton 
                color={overdueCount > 0 ? 'error' : 'default'}
                title="Notifications"
              >
                <Badge badgeContent={overdueCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton 
                color="inherit" 
                onClick={toggleThemeMode}
                title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Side drawer - permanent on desktop, temporary on mobile */}
        <Box
          component="nav"
          sx={{ 
            width: { md: drawerWidth },
            flexShrink: { md: 0 } 
          }}
        >
          {/* Mobile drawer */}
          {isMobile && (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                '& .MuiDrawer-paper': { 
                  width: drawerWidth,
                  boxSizing: 'border-box' 
                },
              }}
            >
              {drawerContent}
            </Drawer>
          )}
          
          {/* Desktop drawer */}
          {!isMobile && (
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': { 
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  borderRight: 1,
                  borderColor: 'divider'
                },
              }}
              open
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>
        
        {/* Main content area */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            p: { xs: 2, sm: 3 },
            mt: 8, // Space for the AppBar
            maxWidth: '100%'
          }}
        >
          {/* Dashboard stats */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
              width: '100%'
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {upcomingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h4" color={overdueCount > 0 ? "error" : "text.secondary"} fontWeight="bold">
                {overdueCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </Box>
          </Box>
          
          {/* Form & filters */}
          <TodoForm 
            onAdd={handleAdd} 
            loading={formLoading} 
            categories={categories}
            sx={{ width: '100%' }}
          />
          
          {showFilters && (
            <TodoFilters 
              onFilterChange={setFilters} 
              categories={categories}
              sx={{ width: '100%' }}
            />
          )}
          
          {/* Todo list */}
          {databaseError ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                mt: 4,
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                minHeight: '200px',
                border: '1px solid',
                borderColor: 'error.main'
              }}
            >
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => fetchTodos()}>
                    Retry
                  </Button>
                }
              >
                Failed to connect to database
              </Alert>
              <Typography color="text.secondary" align="center">
                Make sure the server is running on port 4000 and your database is properly configured
              </Typography>
            </Box>
          ) : (loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px' 
            }}>
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
                    borderRadius: 2,
                    boxShadow: 1,
                    minHeight: '200px'
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
          ))}
          
          {/* Footer */}
          <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Advanced Todo App © {new Date().getFullYear()}
            </Typography>
          </Box>
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
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App; 