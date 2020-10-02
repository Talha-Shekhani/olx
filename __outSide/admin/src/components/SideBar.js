import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import { NavbarBrand, Card, CardBody } from 'reactstrap'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import '../App.css';
import Dashboard from './Dashboard';
import Ads from './Ads';

function SideBar(props) {
    const [visible, setVisible] = useState(0)

    const toggleNav = () => {
        // console.log(window.innerWidth)
        if (visible === 0) {
            setVisible(200)
            document.body.style.background = 'rgba(0, 0, 0, .4)'
            document.getElementById('main').style.filter = 'blur(2px)'
            document.getElementById('main').style.userSelect = 'none'
        }
        else {
            setVisible(0)
            document.body.style.background = 'white'
            document.getElementById('main').style.filter = 'blur(0)'
            document.getElementById('main').style.userSelect = 'auto'
        }
    }

    useEffect(() => {
        document.getElementById('main').addEventListener('click', () => {
            if (visible !== 0)
                toggleNav()
        })
    })

    if (props)

        return (
            <>
                <div >
                    <div id="mySidenav" className="sidenav" style={{ width: visible }}
                        onBlur={toggleNav} >
                        <a style={{ cursor: 'pointer' }} className='closeBtn' onClick={toggleNav} >&times;</a>
                        <NavbarBrand className='d-inline-flex flex-row nav-brand' >
                            <span className='fa fa-user-o' style={{ alignSelf: 'center', fontSize: 20 }} ></span>
                            <h3 style={{ margin: 5 }} >Admin Panel</h3>
                        </NavbarBrand>
                        <hr style={{ color: 'white', height: 1, background: 'white' }} />
                        <NavLink to='/admin/dashboard' >Dashboard</NavLink>
                        <NavLink to='/admin/user'>User</NavLink>
                        <NavLink to='/admin/ads'>Ads</NavLink>
                        <NavLink to='/admin'>Details</NavLink>
                        {/* <Redirect to='/admin/dashboard' ></Redirect> */}
                    </div>
                    <div id="main"
                    // style={{ marginLeft: window.innerWidth < 920 ? 0 : visible, height: window.outerHeight }} 
                    >
                        <Card style={{ background: 'transparent' }} >
                            <CardBody style={{ padding: '.5rem' }} >
                                <span style={{ fontSize: 20, paddingLeft: 15, cursor: 'pointer' }} onClick={toggleNav} >&#9776;</span>
                            </CardBody>
                        </Card>
                        <Switch>
                            <Route path='/admin/dashboard' component={() => <Dashboard />} />
                            <Route path='/admin/ads' component={() => <Ads />} />
                        </Switch>
                    </div>
                </div>
            </>
        )
}

export default SideBar;

