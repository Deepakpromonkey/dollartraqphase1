import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import configureStore from './store' 

import '@fontsource/inter'

const store = configureStore();


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
)