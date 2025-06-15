import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  SelectChangeEvent,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Todo, TodoUpdate } from '../api';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

interface TodoEditDialogProps {
  open: boolean;
  onClose: () => void;
  todo: Todo | null;
  onSave: (id: number, data: TodoUpdate) => Promise<void>;
  categories: string[];
}

const TodoEditDialog: React.FC<TodoEditDialogProps> = ({
  open,
  onClose,
  todo,
  onSave,
  categories
}) => {
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (todo) {
      setName(todo.name);
      setShortDescription(todo.shortDescription);
      // Format datetime for input
      const date = new Date(todo.dateTime);
      // Format as YYYY-MM-DDThh:mm
      setDateTime(date.toISOString().slice(0, 16));
      setIsDone(todo.isDone);
      setPriority(todo.priority);
      setCategory(todo.category);
      setTags(todo.tags || []);
    }
  }, [todo]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    if (e.target.value === 'add-new') {
      setCategory(newCategory);
    } else {
      setCategory(e.target.value);
    }
  };

  const handleSave = async () => {
    if (!todo) return;
    
    setSaving(true);
    try {
      await onSave(todo.id, {
        name,
        shortDescription,
        dateTime,
        isDone,
        priority,
        category,
        tags
      });
      onClose();
    } catch (err) {
      console.error('Failed to update todo:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!todo) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Task Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label="Description"
            fullWidth
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            multiline
            rows={2}
          />
          
          <TextField
            label="Date & Time"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          
          <FormControlLabel
            control={<Switch checked={isDone} onChange={(e) => setIsDone(e.target.checked)} />}
            label="Mark as completed"
          />
          
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              label="Priority"
            >
              {PRIORITY_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
              <MenuItem value="add-new">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Add new: </span>
                  <TextField
                    size="small"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCategory) {
                        e.preventDefault();
                        setCategory(newCategory);
                      }
                    }}
                  />
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput) {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button variant="outlined" onClick={handleAddTag}>Add</Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoEditDialog; 