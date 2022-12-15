import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'
import { Todo } from './mocks/handlers'

export const App: React.FC = () => {
  const [todos, setTodos] = useState([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [newTodoText, setNewTodoText] = useState<string>('')
  const [randomFact, setRandomFact] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)

  const fetchAllTodos = async () => {
    try {
      const todos = await axios.get('/todo')
      setTodos(todos.data)
      setSelectedTodo(null)
    } catch (error) {
      console.error(error)
      setHasError(true)
    }
  }

  const addNewTodo = async () => {
    if (!!newTodoText) {
      await axios.post('/todo', { todoText: newTodoText })
      setNewTodoText('')
      fetchAllTodos()
    }
  }

  useEffect(() => {
    fetchAllTodos()
  }, [])

  const getRandomFact = async () => {
    const randomCatFact = await axios.get('https://catfact.ninja/fact')
    setSelectedTodo(null)
    setRandomFact(randomCatFact.data.fact)
  }

  const selectTodo = async (id: string) => {
    const todoResponse = await axios.get(`/todo/${id}`)
    setSelectedTodo(todoResponse.data)
    setTodos([])
  }

  return (
    <div className="App">
      {hasError ? (
        <div
          data-testid={'error'}
          className={'error'}
        >
          Something broke, damn
        </div>
      ) : (
        <>
          {todos.length > 0 && (
            <div>
              {todos.map((todo: Todo) => (
                <div
                  className="todo-item"
                  key={todo.id}
                  onClick={() => selectTodo(todo.id)}
                >
                  {todo.text}
                </div>
              ))}
            </div>
          )}

          {selectedTodo && (
            <div className="todo-item">
              <strong>Im the selected Todo:</strong> {selectedTodo.text}
            </div>
          )}

          {!selectedTodo && (
            <div className={'todo-form-wrapper'}>
              <div className={'todo-form'}>
                <label htmlFor="todo-name"> Todo Name</label>
                <input
                  id="todo-name"
                  value={newTodoText}
                  onChange={(event) => setNewTodoText(event.target.value)}
                />
                <button
                  data-testid={'add-todo-button'}
                  className={'add-todo'}
                  onClick={() => addNewTodo()}
                >
                  Add new Todo
                </button>
              </div>
            </div>
          )}

          <button
            className={'button'}
            onClick={() => fetchAllTodos()}
          >
            GO BACK
          </button>
          <button onClick={() => getRandomFact()}>GIVE ME SOME RANDOM FACT</button>
          {randomFact && (
            <div>
              <strong>RANDOM FACT:</strong> {randomFact}{' '}
            </div>
          )}
        </>
      )}
    </div>
  )
}
