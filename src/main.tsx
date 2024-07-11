
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { StyledEngineProvider } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <App />
      </StyledEngineProvider>
    </BrowserRouter>
);