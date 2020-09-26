import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Nav, Navbar, NavLink, NavbarToggler, NavItem, NavbarBrand, NavbarText, Collapse, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { baseUrl } from '../baseUrl';


function Header(props) {

    const st = useSelector(state => state.ads)
    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/" className='p-0' >
                    <img src={baseUrl + 'OLX_BLUE_LOGO.png'} style={{width: 60}} />
                    </NavbarBrand>
                <NavbarToggler onClick={handleToggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/"></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>Options</DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Option 1
                </DropdownItem>
                                <DropdownItem>
                                    Option 2
                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    Reset
                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <NavbarText>Simple Text</NavbarText>
                </Collapse>
            </Navbar>
        </>
    )
}

export default Header;
