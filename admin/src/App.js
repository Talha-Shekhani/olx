import React, { useState } from 'react';
// import logo from './logo.svg';
import { Nav, NavItem, Navbar, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import SideBar from './components/SideBar'
import './App.css';
import { configureStore } from './redux/ConfigureStore';

const store = configureStore()

function App(props) {
  return (
    <Provider store={store} >
      <BrowserRouter>
        <>
          <SideBar />
        </>
      </BrowserRouter>
    </Provider>

  )
}

export default App;
