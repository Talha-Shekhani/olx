import React, { useState } from 'react';
// import logo from './logo.svg';
import { Nav, NavItem, Navbar, NavbarBrand, Collapse, NavbarToggler, Button } from 'reactstrap'
// import {
//     Checkbox,
//     Grid,
//     // Header,
//     Icon,
//     Image,
//     Menu,
//     Segment,
//     Sidebar,
//     GridColumn,
//     MenuItem,
// } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import '../App.css';

function Header(props) {
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [visible, setVisible] = useState('0')

    const toggleNav = () => {
        // console.log(props)
        console.log(window.innerWidth - visible)
        if (visible == 0)
            setVisible(250)
        else setVisible(0)
    }
    return (
        <>
            <div id="mySidenav" className="sidenav" style={{ width: visible }}>
                <a className="closebtn" onClick={toggleNav}>&times;</a>
                <NavLink to='/'>About</NavLink>
                <NavLink to='/'>Services</NavLink>
                <NavLink to='/'>Clients</NavLink>
                <NavLink to='/'>Contact</NavLink>
            </div>
            <div id="main" style={{ marginLeft: visible }} >
                <h2>Sidenav Push Example</h2>
                <p>Click on the element below to open the side navigation menu, and push this content to the right.</p>
                <span onClick={toggleNav} >&#9776; open</span>
            </div>
        </>
    )
}

export default Header;

