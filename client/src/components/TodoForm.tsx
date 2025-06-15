import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, CircularProgress, Alert, 
  FormControl, InputLabel, Select, MenuItem, Chip, 
  OutlinedInput, SelectChangeEvent
} from '@mui/material';
import { TodoCreate } from '../api';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

interface TodoFormProps {
  onAdd: (data: TodoCreate) => Promise<void>;
  loading: boolean;
  categories: string[];
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, loading, categories }) => {
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [category, setCategory] = useState('General');
  const [newCategory, setNewCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDescription || !dateTime) {
      setError('Name, description and date/time are required');
      return;
    }
    try {
      await onAdd({ 
        name, 
        shortDescription, 
        dateTime, 
        priority, 
        category, 
        tags 
      });
      // Reset form
      setName('');
      setShortDescription('');
      setDateTime('');
      setPriority('MEDIUM');
      setCategory('General');
      setTags([]);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add todo');
    }
  };

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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Task Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          sx={{ flexGrow: 1, minWidth: '200px' }}
          size="small"
        />
        <TextField
          label="Description"
          value={shortDescription}
          onChange={e => setShortDescription(e.target.value)}
          required
          sx={{ flexGrow: 2, minWidth: '300px' }}
          size="small"
        />
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Date & Time"
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          required
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: '200px' }}
        />
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
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
        
        <FormControl size="small" sx={{ minWidth: '200px' }}>
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
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <TextField
          label="Add Tags"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          size="small"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && tagInput) {
              e.preventDefault();
              handleAddTag();
            }
          }}
          sx={{ minWidth: '150px' }}
        />
        <Button size="small" variant="outlined" onClick={handleAddTag}>Add Tag</Button>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              onDelete={() => handleRemoveTag(tag)} 
            />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{ minWidth: '120px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Task'}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  );
};

export default TodoForm; 