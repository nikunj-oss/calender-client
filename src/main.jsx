import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../index.css"
import App from './App.jsx'
import { CssBaseline } from '@mui/material';
import {BrowserRouter as Router} from "react-router-dom"
import Auth0ProviderWithNavigate from './authentication/Auth0ProviderWithNavigate.jsx'
import { Provider } from 'react-redux'
import store from '../redux/store.js'
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Router>
    <Auth0ProviderWithNavigate>
    <Toaster visibleToasts={1} position='top-right' richColors/>
    <CssBaseline />
      <App />
    </Auth0ProviderWithNavigate>
    </Router>
    </Provider>
  </StrictMode>,
)
