import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css';
import { configureStore } from './redux/ConfigureStore';
import { fetchAds } from './redux/Actions'
import Main from './components/Main';

const store = configureStore()

function App() {
  // const [ads]

  useEffect(() => {
    fetchAds()
  }, [])
  return (
    <Provider store={store} >
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>

  );
}

export default App;
