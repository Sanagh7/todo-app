require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const cors = require('cors');
const { body, param, query, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Helper: error formatter
const formatValidationErrors = (errors) => errors.array().map(e => e.msg).join(', ');

// List Todos (with optional filter and search)
app.get('/api/todos', [
  query('filter').optional().isString(),
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: formatValidationErrors(errors) });

  try {
    const { filter, search, category, priority } = req.query;
    let where = {};
    
    // Status filter
    if (filter === 'done') where.isDone = true;
    if (filter === 'upcoming') where = { isDone: false, dateTime: { gt: new Date() } };
    // "all" filter is implicit (empty where object)
    
    // Search by name or description
    if (search) {
      // If we already have filter conditions, add search as an AND condition
      if (where.isDone !== undefined || where.dateTime !== undefined) {
        where = {
          AND: [
            where,
            {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } }
              ]
            }
          ]
        };
      } else {
        // Simple search with no other conditions
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } }
        ];
      }
    }
    
    // Category filter
    if (category) {
      where.category = category;
    }
    
    // Priority filter
    if (priority) {
      where.priority = priority;
    }
    
    console.log("Query filter:", filter);
    console.log("Final where clause:", JSON.stringify(where));

    // Get todos with filters applied
    const todos = await prisma.todo.findMany({ 
      where, 
      orderBy: [
        { priority: 'desc' },
        { dateTime: 'asc' }
      ] 
    });
    
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.todo.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add Todo
app.post('/api/todos', [
  body('name').isString().isLength({ min: 1 }).withMessage('Name is required'),
  body('shortDescription').isString().isLength({ min: 1 }).withMessage('Short description is required'),
  body('dateTime').isISO8601().withMessage('Valid dateTime is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: formatValidationErrors(errors) });
  try {
    const { name, shortDescription, dateTime, priority = 'MEDIUM', category = 'General', tags = [] } = req.body;
    const todo = await prisma.todo.create({ 
      data: { 
        name, 
        shortDescription, 
        dateTime: new Date(dateTime), 
        isDone: false,
        priority,
        category,
        tags
      } 
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update Todo
app.put('/api/todos/:id', [
  param('id').isInt().withMessage('Valid id required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('shortDescription').optional().isString().withMessage('Short description must be a string'),
  body('dateTime').optional().isISO8601().withMessage('dateTime must be a valid ISO8601 date'),
  body('isDone').optional().isBoolean().withMessage('isDone must be boolean'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Priority must be LOW, MEDIUM, HIGH, or URGENT'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: formatValidationErrors(errors) });
  try {
    const { id } = req.params;
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.shortDescription !== undefined) data.shortDescription = req.body.shortDescription;
    if (req.body.dateTime !== undefined) data.dateTime = new Date(req.body.dateTime);
    if (req.body.isDone !== undefined) data.isDone = req.body.isDone;
    if (req.body.priority !== undefined) data.priority = req.body.priority;
    if (req.body.category !== undefined) data.category = req.body.category;
    if (req.body.tags !== undefined) data.tags = req.body.tags;
    
    const todo = await prisma.todo.update({ where: { id: Number(id) }, data });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Todo not found or update failed' });
  }
});

// Delete Todo
app.delete('/api/todos/:id', [
  param('id').isInt().withMessage('Valid id required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: formatValidationErrors(errors) });
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Todo not found or delete failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 