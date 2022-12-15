import { rest } from 'msw'

export interface Todo {
  id: string
  text: string
}

const todos: Array<Todo> = [
  { id: '1', text: 'This is my FIRST todo' },
  { id: '2', text: 'This is my SECOND todo' },
]
/*
req, an information about a matching request;
res, a functional utility to create the mocked response;
ctx, a group of functions that help to set a status code, headers, body, etc. of the mocked response.
*/

export const mockApiHandlers = [
  // Handles a GET /todo
  // Handles a GET /todo/:id request
  // Handles a POST /todo to create a todo
]
