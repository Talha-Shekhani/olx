import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Nav, Navbar, NavLink, NavbarToggler, NavItem, Collapse, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import Login from './Login';
import { baseUrl, imageUrl } from '../baseUrl';


function AdDetail(props) {

    const cat = useSelector(state => state.categories)
    const subCat = useSelector(state => state.subcategories)

    return (
        <>
        <div>
            <p>addetail</p>
        </div>
        </>
    )
}

export default AdDetail
