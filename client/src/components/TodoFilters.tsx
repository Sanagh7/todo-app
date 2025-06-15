import React, { useState } from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { TodoFilter } from '../api';

interface TodoFiltersProps {
  onFilterChange: (filters: TodoFilter) => void;
  categories: string[];
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState<TodoFilter>({ filter: 'all' });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const handleFilterChange = (value: 'all' | 'done' | 'upcoming' | null) => {
    const newFilters = { ...filters, filter: value || 'all' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSearch = () => {
    const newFilters = { ...filters, search: searchInput || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleClearSearch = () => {
    setSearchInput('');
    const newFilters = { ...filters, search: undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const category = e.target.value as string;
    const newFilters = { 
      ...filters, 
      category: category === 'all' ? undefined : category 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriorityChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const priority = e.target.value as string;
    const newFilters = { 
      ...filters, 
      priority: priority === 'all' ? undefined : priority as any
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleResetFilters = () => {
    setFilters({ filter: 'all' });
    setSearchInput('');
    onFilterChange({ filter: 'all' });
  };
  
  return (
    <Paper sx={{ mb: 3, p: 2 }} elevation={1}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={filters.filter}
            exclusive
            onChange={(_, val) => handleFilterChange(val || 'all')}
            aria-label="status filter"
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="done">Completed</ToggleButton>
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
          </ToggleButtonGroup>
          
          <IconButton 
            onClick={() => setShowAdvanced(!showAdvanced)}
            color={showAdvanced ? 'primary' : 'default'}
          >
            <FilterIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            sx={{ flexGrow: 1 }}
            InputProps={{
              endAdornment: searchInput ? (
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null
            }}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        
        <Collapse in={showAdvanced}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || 'all'}
                onChange={handleCategoryChange as any}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority || 'all'}
                onChange={handlePriorityChange as any}
                label="Priority"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ marginLeft: 'auto' }}>
              <IconButton onClick={handleResetFilters} title="Reset all filters">
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default TodoFilters; 