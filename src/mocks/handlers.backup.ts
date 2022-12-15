import { rest } from 'msw'

export interface Todo {
  id: string
  text: string
}

const todos: Array<Todo> = [
  { id: '1', text: 'This is my FIRST todo' },
  { id: '2', text: 'This is my SECOND todo' },
]

export const mockApiHandlers = [
  // Handles a GET /todo
  rest.get('/todo', (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(todos),
    )
  }),

  // Handles a GET /todo/:id request
  rest.get('/todo/:id', (req, res, ctx) => {
    const todoId = req.params.id
    const todo = todos.find((todo) => todo.id === todoId)
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(todo),
    )
  }),

  // Handles a POST /todo to create a todo
  rest.post('/todo', async (req, res, ctx) => {
    const { todoText } = await req.json()

    const latestId = todos[todos.length - 1].id
    todos.push({ id: latestId + 1, text: todoText })

    return res(ctx.status(200))
  }),
]
