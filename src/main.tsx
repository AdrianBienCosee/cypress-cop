import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { setupWorker } from 'msw'
import { mockApiHandlers } from './mocks/handlers'
import axios from 'axios'

// const worker = setupWorker(...mockApiHandlers)
// await worker.start()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
