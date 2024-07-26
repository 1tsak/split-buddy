
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { StyledEngineProvider } from '@mui/material';
import './i18next.ts'; 
import 'rsuite/dist/rsuite.min.css'; 
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
      <App />
      </Provider>
      </StyledEngineProvider>
    </BrowserRouter>
);