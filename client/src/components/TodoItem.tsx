import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Checkbox, IconButton, 
  Box, Chip, Collapse, CardActions, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { Todo } from '../api';

const priorityColors = {
  'LOW': '#8bc34a',      // Light green
  'MEDIUM': '#ffeb3b',   // Yellow
  'HIGH': '#ff9800',     // Orange
  'URGENT': '#f44336'    // Red
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, onToggle, onDelete, onEdit 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const isDueDate = new Date(todo.dateTime) < new Date();
  const isUpcoming = !todo.isDone && new Date(todo.dateTime) > new Date();
  
  const formattedDate = new Date(todo.dateTime).toLocaleString();
  
  return (
    <>
      <Card 
        elevation={2} 
        sx={{ 
          mb: 2,
          bgcolor: todo.isDone ? 'action.selected' : 'background.paper',
          borderLeft: `4px solid ${priorityColors[todo.priority] || 'grey'}`,
          opacity: todo.isDone ? 0.8 : 1,
          transition: 'all 0.3s'
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Checkbox
              checked={todo.isDone}
              onChange={() => onToggle(todo)}
              sx={{ pt: 0 }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{ 
                    textDecoration: todo.isDone ? 'line-through' : 'none',
                    wordBreak: 'break-word'
                  }}
                >
                  {todo.name}
                </Typography>
                
                <Chip 
                  size="small" 
                  label={todo.category} 
                  color="primary" 
                  variant="outlined" 
                />
                
                {isDueDate && !todo.isDone && (
                  <Chip 
                    size="small"
                    icon={<TimeIcon fontSize="small" />} 
                    label="Overdue" 
                    color="error" 
                  />
                )}
                
                {isUpcoming && (
                  <Chip 
                    size="small"
                    icon={<TimeIcon fontSize="small" />} 
                    label="Upcoming" 
                    color="info" 
                  />
                )}
                
                {todo.isDone && (
                  <Chip 
                    size="small"
                    icon={<CheckCircleIcon fontSize="small" />} 
                    label="Completed" 
                    color="success" 
                  />
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  textDecoration: todo.isDone ? 'line-through' : 'none',
                  mb: 1
                }}
              >
                {todo.shortDescription}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlagIcon sx={{ fontSize: 'small', color: priorityColors[todo.priority] }} />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {todo.priority}
                  </Typography>
                </Box>
                
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                  {formattedDate}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {todo.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            
            <Box>
              <IconButton 
                aria-label="expand" 
                onClick={handleToggleExpand}
                size="small"
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
        </CardContent>
        
        <Collapse in={expanded}>
          <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
            <Button
              startIcon={<EditIcon />}
              size="small"
              onClick={() => onEdit(todo)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              color="error"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          </CardActions>
        </Collapse>
      </Card>
      
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{todo.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            onClick={() => {
              onDelete(todo.id);
              setDeleteConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem; 