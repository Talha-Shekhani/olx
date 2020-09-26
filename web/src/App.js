import React, { useEffect, useReducer } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import './App.css';
import { configureStore } from './redux/ConfigureStore';
import Header from './components/Header';
import { ads } from './redux/ads';
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
