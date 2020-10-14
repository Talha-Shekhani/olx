import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux'
// import logo from './logo.svg';
import { Table, Button, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, Navbar, FormGroup, Label, Input, Col } from 'reactstrap'
import { Formik } from 'formik'
import { baseUrl } from '../baseUrl'
import { fetchAds } from './Users';

function Ads() {
    const [ads, setAds] = useState([])
    const [cat, setCat] = useState([])
    const [subcat, setSubcat] = useState([])
    // const [selectedAd, setSelectedAd] = useState(0)
    const [loc, setLoc] = useState([])
    const [city, setCity] = useState([])
    const [selectedCat, setSelectedCat] = useState(0)
    const [selectedSubcat, setSelectedSubcat] = useState(0)
    const [selectedCity, setSelectedCity] = useState(0)
    const store = useStore()

    useEffect(() => {
        // console.log(store.getState())
        fetchAds()
            .then((res) => {
                setAds(res)
            })
        fetchCategories().then((res) => {
            setCat(res)
        })
        fetchSubCategories().then((res) => {
            setSubcat(res)
        })
        fetchCity().then((res) => {
            setCity(res)
        })
        fetchLoc().then((res) => {
            setLoc(res)
        })
    }, [fetchCategories, fetchSubCategories, fetchCity])

    return (
        <>
            <Navbar className='navAds'>
                <Nav className="mr-auto col-12">
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4' >
                        <Label for="cat" sm={4}>Category: </Label>
                        <Col sm={8}>
                            <Input type="select" name="select" id="cat" onChange={(e) => { setSelectedCat(e.target.value); setSelectedSubcat(0) }} >
                                <option key={0} value={0} >--Select--</option>
                                {cat.map((item) => {
                                    return (
                                        <option key={item.cat_id} value={item.cat_id} >{item.title}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4'>
                        <Label for='subcat' sm={6}>Sub-Category: </Label>
                        <Col sm={6} >
                            <Input type="select" name="select" id="subcat" onChange={(e) => { setSelectedSubcat(e.target.value) }} >
                                <option key={0} value={0} >--Select--</option>
                                {subcat.filter(item => item.cat_id == selectedCat).map((item) => {
                                    return (
                                        <option key={item.subcat_id} value={item.subcat_id} >{item.title}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4'>
                        <Label for="exampleSelect" sm={4}>City: </Label>
                        <Col sm={8}>
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => { setSelectedCity(e.target.value) }} >
                                <option key={0} value={0} >--Select--</option>
                                {city.map((item) => {
                                    return (
                                        <option key={item.id} value={item.id} >{item.city}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                </Nav>
            </Navbar>
            <div className='mt-5' >
                <Table hover responsive  >
                    <tbody>
                        <tr className='adminAdTable' >
                            <th>Id</th><th>UserId</th><th>Title</th><th>Description</th><th>Amount</th>
                            <th>created at</th><th>updated at</th><th>Active?</th>
                            <th>type</th>
                        </tr>
                        {/* <tr><td colSpan={7} >{JSON.stringify(ads.map(item => selectedCity == 0 ? (selectedSubcat == 0 ? selectedCat != 0 ? item.category_id == selectedCat : true : true || selectedSubcat != 0 ? item.sub_category_id == selectedSubcat : true) : true
                        || selectedCity != 0 ? (selectedSubcat == 0 ? selectedCat != 0 ? item.category_id == selectedCat : true : true || selectedSubcat != 0 ? item.sub_category_id == selectedSubcat : true) && loc.filter(itm => itm.id == item.area_id && itm.c_id == selectedCity).map((itm) => item.area_id == itm.c_id)[0] : true))}</td></tr> */}
                        {ads.filter(item => selectedCity == 0 ? (selectedSubcat == 0 ? selectedCat != 0 ? item.category_id == selectedCat : true : true || selectedSubcat != 0 ? item.sub_category_id == selectedSubcat : true) : true
                        || selectedCity != 0 ? (selectedSubcat == 0 ? selectedCat != 0 ? item.category_id == selectedCat : true : true || selectedSubcat != 0 ? item.sub_category_id == selectedSubcat : true) && loc.filter(itm => itm.id == item.area_id && itm.c_id == selectedCity).map((itm) => item.area_id == itm.c_id)[0] : true
                        ).map((item, index) => (
                                <tr key={index}
                                    className='adminAdTableRow' >
                                    <td>{item.id}</td>
                                    <td>{item.user_id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(item.price)}</td>
                                    {/* <td>{item.category_id}</td>
                                <td>{item.category_id}</td>
                                <td>{item.category_id}</td> */}
                                    <td>{item.created_date}</td>
                                    <td>{item.updated_date}</td>
                                    <td>{item.active}</td>
                                    <td>{item.type}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export const fetchTransactionDetails = () => {
    return fetch(`${baseUrl}admin/adsDetail`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}

export const putPaid = (adId, paid) => {
    return fetch(`${baseUrl}admin/putPaid`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId: adId, paid: paid })
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}

export const fetchCategories = () => {
    return fetch(`${baseUrl}fetchCat`, {
        mode: 'cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        // .then (response => console.log((response)))
        .then(response => { return response })
        .catch(error => { return error })
}

export const fetchSubCategories = () => {
    return fetch(`${baseUrl}fetchSubcat`, {
        mode: 'cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        // .then (response => console.log((response)))
        .then(response => { return response })
        .catch(error => { return error })
}

export const fetchCity = () => {
    return fetch(`${baseUrl}loc/city`, {
        mode: 'cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}

export const fetchLoc = () => {
    return fetch(`${baseUrl}loc`, {
        mode: 'cors',
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                return error
            }
        },
            error => {
                var errmess = new Error(error.message)
                return errmess
            })
        .then((response) => { return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}

export default Ads

{/* <Formik initialValues={{ name: '' }}
                validate={(values) => {
                    const errors = {}
                    if (!values.name) errors.name = 'Required'
                    else if (values.name < 5) errors.name = 'More than 5'
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched }) => (
                    <form onSubmit={handleSubmit} >
                        <input
                            type='text'
                            name="name"
                            onChange={handleChange}
                            // onBlur={handleBlur}
                            value={values.name}
                        />
                        {errors.name && touched.name}
                        <button type='submit' disabled={isSubmitting} >Submit</button>
                    </form>
                )}
            </Formik> */}