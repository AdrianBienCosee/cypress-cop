import { rest } from 'msw'
import { mockApiHandlers } from './mocks/handlers'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from './App'
import { describe, expect, test } from 'vitest'
import { mockApiForJest, requestMatching } from './utils/tests/test-helpers'

const { capturedRequests, overrideHandler } = mockApiForJest(...mockApiHandlers)

describe('App.ts', function () {
  test('displays a list of todos', async () => {
    render(<App />)
    const todo = screen.findByText('This is my FIRST todo')

    expect(todo).toBeDefined()

    await waitFor(() => {
      expect(capturedRequests()).toContainEqual(
        requestMatching({ pathname: '/todo', method: 'GET' }),
      )
    })
  })

  test('adds a new todo when clicking the button', async () => {
    render(<App />)

    const input = screen.getByLabelText('Todo Name')

    expect(input).toBeDefined()

    fireEvent.change(input, { target: { value: 'my awesome new todo' } })

    const addButton = screen.getByTestId('add-todo-button')

    expect(addButton).toBeDefined()

    fireEvent.click(addButton)

    await waitFor(() => {
      expect(capturedRequests()).toContainEqual(
        requestMatching({
          pathname: '/todo',
          method: 'POST',
          body: {
            todoText: 'my awesome new todo',
          },
        }),
      )
    })
  })

  test('overridehandler to test error', async () => {
    const mockedErrorHandler = rest.get('/todo', (req, res, ctx) => {
      return res(
        // Respond with a 500 status code
        ctx.status(500),
      )
    })
    overrideHandler(mockedErrorHandler)

    render(<App />)

    await waitFor(() => {
      expect(capturedRequests()).toContainEqual(
        requestMatching({ pathname: '/todo', method: 'GET' }),
      )
    })

    const errorText = screen.getByTestId('error')

    expect(errorText).toBeDefined()
  })
})
