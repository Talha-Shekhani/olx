import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCity, fetchProvince, postAd } from '../redux/Actions';
import { Formik } from 'formik'
import { Form, FormGroup, Label, Input, FormText, Button, Col, Row, CustomInput } from 'reactstrap';

function Sell() {
    const dispatch = useDispatch()
    const cat = useSelector(state => state.categories)
    const subcat = useSelector(state => state.subcategories)
    const loc = useSelector(state => state.loc)
    var res = window.localStorage.getItem('userdata')
    var rs = JSON.parse(res)
    rs = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rs)
    const [img, setImg] = useState([])

    useEffect(() => {

    }, [])

    const uploadFile = (e, setFieldValue) => {
        let files = []
        for (let i = 0; i < e.currentTarget.files.length; i++)
            files.push(e.currentTarget.files[i])
        setFieldValue('img', files)
    }

    const cats = (catId, handleChange, values, setFieldValue) => {
        let reader = new FileReader()
        // if (catId == 1) {
        return (
            <>
                <Row form className='my-2'>
                    <Row form>
                        <Label check className='pl-2' >Condition: </Label>
                        <FormGroup check className='mx-4' onChange={handleChange} >
                            <Label check>
                                <Input type="radio" name="condition" value='old' required />Old
                        </Label>
                        </FormGroup>
                        <FormGroup check className='mx-4' onChange={handleChange} >
                            <Label check>
                                <Input type="radio" name="condition" value='new' required />New
                        </Label>
                        </FormGroup>
                    </Row>
                </Row>
                <FormGroup row>
                    <Label for="title" className='col-2'>Title: </Label>
                    <Col sm={10}>
                        <Input type="text" name="title" id="title" placeholder="Title" maxLength={70}
                            onChange={handleChange} required pattern='[A-Za-z0-9]{7,}' />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="description" className='col-2'>Description: </Label>
                    <Col sm={10}>
                        <Input type="textarea" name="description" id="description" placeholder="description" maxLength={500}
                            onChange={handleChange} required pattern='.{20,}' />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="price" className='col-2'>Price: </Label>
                    <Col sm={10}>
                        <Input type="number" name="price" id="price" placeholder="price" min={500}
                            onChange={handleChange} required pattern='[0-9]{3,}' />
                    </Col>
                </FormGroup>
                <Row form>
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4'>
                        <Label for='province' sm={3}>Province: </Label>
                        <Col sm={9} >
                            <Input type="select" name="province" id="province" onChange={handleChange} required >
                                <option key={0} value='' >--Select--</option>
                                {loc.province.map((item) => {
                                    return (
                                        <option key={item.id} value={item.id} >{item.province}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4'>
                        <Label for='city' sm={3}>City: </Label>
                        <Col sm={9} >
                            <Input type="select" name="city" id="city" onChange={handleChange} required >
                                <option key={0} value='' >--Select--</option>
                                {loc.city.filter(item => item.p_id == values.province).map((item) => {
                                    return (
                                        <option key={item.id} value={item.id} >{item.city}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row className='my-2 col-12 col-md-6 col-lg-4'>
                        <Label for='loc' sm={3}>Area: </Label>
                        <Col sm={9} >
                            <Input type="select" name="loc" id="loc" onChange={handleChange} required >
                                <option key={0} value='' >--Select--</option>
                                {loc.loc.filter(item => item.c_id == values.city).map((item) => {
                                    return (
                                        <option key={item.id} value={item.id} >{item.area}</option>
                                    )
                                })}
                            </Input>
                        </Col>
                    </FormGroup>
                </Row>

                <FormGroup>
                    <Label for="img">File Browser with Custom Label</Label>
                    <CustomInput type="file" id="img" name="img" label="Select Images" accept='image/*' multiple formEncType='multipart/form-data'
                        onChange={(e) => uploadFile(e, setFieldValue)} />
                </FormGroup>

                <Row form className='my-2'>
                    <Row form>
                        <Label check className='pl-2' >Package: </Label>
                        <FormGroup check className='mx-4' onChange={handleChange} >
                            <Label check>
                                <Input type="radio" name="type" value='basic' required />Basic
                        </Label>
                        </FormGroup>
                        <FormGroup check className='mx-4' onChange={handleChange} >
                            <Label check>
                                <Input type="radio" name="type" value='premium' required />Premium
                        </Label>
                        </FormGroup>
                    </Row>
                </Row>
            </>
        )
        // }
    }

    return (
        <>
            {/* {JSON.stringify(cat)} */}
            <Formik initialValues={{
                catId: '', subcatId: '', condition: '', title: '', description: '', price: '',
                province: '', city: '', loc: '', img: [], type: ''
            }}
                validate={(values) => {
                    const errors = {}
                    if (!values.catId) errors.catId = 'Required'
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        dispatch(postAd(userId, values))
                        setSubmitting(false);
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched, setFieldValue }) => (
                    <Form className='col-12' onSubmit={handleSubmit} >
                        <Row form>
                            <FormGroup row className='my-2 col-12 col-md-6 col-lg-6' >
                                <Label for="catId" sm={4}>Category: </Label>
                                <Col sm={8}>
                                    <Input type="select" name="catId" id="catId" onChange={handleChange} value={values.catId} required >
                                        <option key={0} value='' >--Select--</option>
                                        {cat.categories.map((item) => {
                                            return (
                                                <option key={item.cat_id} value={item.cat_id} >{item.title}</option>
                                            )
                                        })}
                                    </Input>
                                    {errors.catId && touched.catId & errors.catId}
                                </Col>
                            </FormGroup>
                            <FormGroup row className='my-2 col-12 col-md-6 col-lg-6'>
                                <Label for='subcatId' sm={4}>Sub-Category: </Label>
                                <Col sm={8} >
                                    <Input type="select" name="subcatId" id="subcatId" onChange={handleChange} required >
                                        <option key={0} value='' >--Select--</option>
                                        {subcat.subcategories.filter(item => item.cat_id == values.catId).map((item) => {
                                            return (
                                                <option key={item.subcat_id} value={item.subcat_id} >{item.title}</option>
                                            )
                                        })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Row>
                        {cats(values.catId, handleChange, values, setFieldValue)}
                        {JSON.stringify(img)}
                        {/* <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleSelect">Select</Label>
                            <Input type="select" name="select" id="exampleSelect">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleSelectMulti">Select Multiple</Label>
                            <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleText">Text Area</Label>
                            <Input type="textarea" name="text" id="exampleText" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleFile">File</Label>
                            <Input type="file" name="file" id="exampleFile" />
                            <FormText color="muted">
                                This is some placeholder block-level help text for the above input.
                                It's a bit lighter and easily wraps to a new line.
                      </FormText>
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <legend>Radio Buttons</legend>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="radio1" />{' '}
                          Option one is this and that—be sure to include why it's great
                        </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="radio1" />{' '}
                          Option two can be something else and selecting it will deselect option one
                        </Label>
                            </FormGroup>
                            <FormGroup check disabled>
                                <Label check>
                                    <Input type="radio" name="radio1" disabled />{' '}
                          Option three is disabled
                        </Label>
                            </FormGroup>
                        </FormGroup>    
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" />{' '}
                        Check me out
                      </Label>
                        </FormGroup> */}
                        <Button type='submit' disabled={isSubmitting} >Submit</Button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Sell