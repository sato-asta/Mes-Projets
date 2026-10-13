import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logo from './assets/logo.png'
import './index.css'
import App from './App.jsx'

const faviconLink = document.querySelector("link[rel='icon']")
if (faviconLink) {
  faviconLink.href = logo
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
