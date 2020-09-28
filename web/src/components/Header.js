import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Nav, Navbar, NavLink, NavbarToggler, NavItem, NavbarBrand, NavbarText, Collapse, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { baseUrl } from '../baseUrl';


function Header(props) {

    const cat = useSelector(state => state.categories)
    const subCat = useSelector(state => state.subcategories)
    const [isOpen, setIsOpen] = useState(false)
    const [caret, setCaret] = useState('down')

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <Navbar color="black" light expand="md" className='bg-white py-0'>
                {/* <NavbarBrand href="/" className='p-0' >
                    <img src={baseUrl + 'OLX_BLUE_LOGO.png'} style={{ width: 60 }} />
                </NavbarBrand> */}
                <NavbarToggler onClick={handleToggle} />
                <Collapse isOpen={isOpen} navbar className='col-12' >
                    <Nav className="mr-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav onClick={() => {
                                console.log(caret); caret === 'down' ? setCaret('up') : setCaret('down')
                            }} >Categories
                            <span className={`fa fa-angle-${caret} mx-2`} ></span>
                            </DropdownToggle >
                            {caret == 'up' && <DropdownMenu right className='d-flex flex-column flex-wrap'
                                style={{
                                    right: 'auto', left: -10, width: window.innerWidth - 80, top: 37, height:
                                        window.innerWidth <= 1024 ? 815 : 814
                                }} >
                                {cat.categories.map((item, index) => {
                                    return (
                                        <div key={index} className='mx-2 d-flex flex-column flex-wrap my-2' style={{ width: '23%' }} >
                                            <b style={{ fontSize: 14 }}>{item.title}</b>
                                            {subCat.subcategories.filter(itm => itm.cat_id == item.cat_id).map((item, index) => (
                                                <DropdownItem key={index} className='p-0' style={{ fontSize: 12 }}
                                                    href={`/${item.name}`} >{item.title}</DropdownItem>
                                            ))}
                                        </div>
                                    )
                                }
                                )}
                            </DropdownMenu>}
                        </UncontrolledDropdown>
                        {cat.categories.map((item, index) => {
                            while (index < 6)
                                return (
                                    <NavItem>
                                        <NavLink href={`/${item.name}`} key={index} >{item.title}</NavLink>
                                    </NavItem>
                                )
                        })}
                    </Nav>
                </Collapse>
            </Navbar>
            <img src='assets/main_pic.jpg' style={{ width: '100%', height: 'auto' }} />
        </>
    )
}

export default Header;
