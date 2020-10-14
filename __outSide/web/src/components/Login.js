import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Carousel, CarouselItem, CarouselIndicators, CarouselCaption, Input, Button, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { baseUrl, imageUrl } from '../baseUrl'
import { Formik, Field } from 'formik'
import * as Actions from '../redux/ActionTypes'
import { useDispatch, useSelector } from 'react-redux';
import { checkUser, fetchAds, fetchFav, fetchCategories, fetchSubCategories, fetchFeat, fetchLoc } from '../redux/Actions';
import { Link } from 'react-router-dom';
// import { useNavigation } from '@react-navigation/native'

function First({ next, previous, items, activeIndex, goToIndex, slides, changeIndex }) {
    return (
        <>
            <Carousel className='loginSlider'
                activeIndex={activeIndex}
                next={next}
                previous={previous} >
                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} className='loginSliderIndicators' />
                {slides}
                {/* <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} /> */}
                <a className="carousel-control-prev loginSliderPrev" onClick={previous} style={{ cursor: 'pointer' }}><span className="fa fa-angle-left" style={{ fontSize: 30 }} aria-hidden="true"></span><span className="sr-only">Previous</span></a>
                <a className="carousel-control-next loginSliderNext" onClick={next} style={{ cursor: 'pointer' }}><span className="fa fa-angle-right" style={{ fontSize: 30 }} aria-hidden="true"></span><span className="sr-only">Next</span></a>
            </Carousel>
            <button className='btns' >Continue with Phone</button>
            <button className='btns' >Continue with Facebook</button>
            <button className='btns' >Continue with Google</button>
            <button className='btns' onClick={() => changeIndex(1)} >Continue with Email</button>
        </>
    )

}

function Second({ email, changeEmail, changeIndex, loggedInUser }) {
    const dispatch = useDispatch()
    const [err, setErr] = useState('')
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
            <img src={imageUrl + 'OLX_LOGO.png'} style={{ width: 50, height: 30, margin: 15 }} />
            <h4>Enter your Email</h4>
            {/* <Input name='email' type='email' placeholder='Email' value={email} chan />
            <button type='button' disabled className='nextInLogin' >Next</button> */}
            <Formik initialValues={{ email: email }}
                validate={(values) => {
                    const errors = {}
                    if (values.email === '') {
                        errors.email = 'Required'
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                        errors.email = 'Invalid email address'
                    }
                    return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        dispatch(fetchUserToStore(email))
                            .then((res) => {
                                if (res !== null && Array.isArray(res)) {
                                    window.localStorage.setItem('userdata', JSON.stringify({ email: res[0].email, id: res[0].id, name: res[0].name, img: res[0].img }))
                                    setSubmitting(false)
                                    changeIndex(2)
                                }
                                else setErr('Email not matched!')
                            })
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched }) => (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }} >
                        <Input
                            type='email'
                            name="email"
                            onChange={(e) => { changeEmail(e.target.value); handleChange(e) }}
                            value={email}
                        />
                        {err && <p style={{ fontSize: 12, color: 'red', margin: '5px 0 0 0' }}>{err}</p>}
                        <button type='submit' disabled={errors.email} className='nextInLogin' >Next</button>
                    </form>
                )}
            </Formik>
        </div>
    )
}

function Third({ password, changePassword, loggedInUser, toggleModal }) {
    const dispatch = useDispatch()
    const [userId, setUserId] = useState(loggedInUser[0].id)

    useEffect(() => {
        return () => {
            dispatch(fetchAds())
            dispatch(fetchFav(userId))
            dispatch(fetchCategories())
            dispatch(fetchSubCategories())
            dispatch(fetchFav(userId))
            dispatch(fetchFeat(userId))
            dispatch(fetchLoc())
        }
    }, [])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
            <img src={imageUrl + 'OLX_LOGO.png'} style={{ width: 50, height: 30, margin: 15 }} />
            <h4>Enter your Password</h4>
            <Formik initialValues={{ pswd: '' }}
                validate={(values) => {
                    const errors = {}
                    if (values.pswd === '') {
                        errors.pswd = 'Required'
                    } else if (!/^[A-Za-z0-9]\w{7,14}$/.test(values.pswd)) {
                        errors.pswd = 'Password must be greater than 7 characters and contain (A-Z,a-z,0-9) characters only!'
                    }
                    return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        dispatch(checkUser(loggedInUser[0].email, values.pswd))
                            .then((res) => {
                                if (res == true) {
                                    dispatch({ type: Actions.ADD_LOGGED_USER_ID })
                                    window.location.reload()
                                }
                            })
                        changePassword(values.pswd)
                        setSubmitting(false);
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched, validateField }) => (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }} >
                        <Input
                            type='password'
                            name="pswd"
                            onChange={handleChange}
                            value={values.pswd}
                        />
                        {errors.pswd && touched.pswd && <p style={{ fontSize: 12, color: 'red', margin: '5px 0 0 0' }}>{errors.pswd}</p>}
                        <button type='submit' disabled={isSubmitting} className='nextInLogin' >Submit</button>
                    </form>
                )}
            </Formik>
        </div>
    )
}

function Login() {
    const [isOpen, setisOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [index, setIndex] = useState(0)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { loggedInUser, loggedInUserId } = useSelector(state => state.users)
    var res = window.localStorage.getItem('userdata')
    var rs = JSON.parse(res)
    var rsId = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rsId)

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const items = [
        {
            src: 'https://statics.olx.com.pk/external/base/img/loginEntryPointPost.png',
            caption: 'Help make OLX safer place to buy and sell',
            key: '1'
        },
        {
            src: 'https://statics.olx.com.pk/external/base/img/loginEntryPointFavorite.png',
            caption: 'Contact and close deals faster',
            key: '2'
        },
        {
            src: 'https://statics.olx.com.pk/external/base/img/loginEntryPointChat.png',
            caption: 'Save all your favorite items in one place',
            key: '3'
        }
    ]

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img src={item.src} alt={item.altText} width='120' style={{ marginLeft: '37%' }} />
                <CarouselCaption captionText={item.caption} className='loginSliderCaption' />
            </CarouselItem>
        );
    });

    const toggleModal = () => {
        setisOpen(!isOpen)
    }
    const changeIndex = (index) => {
        setIndex(index)
    }

    const changeEmail = (email) => {
        setEmail(email)
    }

    const changePassword = (pswd) => {
        setPassword(pswd)
    }

    const indexing = () => {
        if (index === 0)
            return (<First items={items} previous={previous} next={next} activeIndex={activeIndex} goToIndex={goToIndex} slides={slides} changeIndex={changeIndex} />)
        else if (index === 1)
            return (<Second email={email} changeEmail={changeEmail} changeIndex={changeIndex} loggedInUser={loggedInUser} />)
        else if (index === 2)
            return (<Third password={password} changePassword={changePassword} loggedInUser={loggedInUser} toggleModal={toggleModal} />)
    }

    const sellBtn = () => {
        return (
            userId == 0 ?
                <Link className='d-flex flex-row noDeco' onClick={toggleModal} >
                    <svg width="104" height="48" viewBox="0 0 1603 768" >
                        <g>
                            <path fill='#fff' d="M434.442 16.944h718.82c202.72 0 367.057 164.337 367.057 367.058s-164.337 367.057-367.057 367.057h-718.82c-202.721 0-367.058-164.337-367.058-367.058s164.337-367.058 367.058-367.058z"></path>
                            <path fill='#ffce39' d="M427.241 669.489c-80.917 0-158.59-25.926-218.705-73.004l-0.016-0.014c-69.113-54.119-108.754-131.557-108.754-212.474 0-41.070 9.776-80.712 29.081-117.797 25.058-48.139 64.933-89.278 115.333-118.966l-52.379-67.581c-64.73 38.122-115.955 90.98-148.159 152.845-24.842 47.745-37.441 98.726-37.441 151.499 0 104.027 50.962 203.61 139.799 273.175h0.016c77.312 60.535 177.193 93.887 281.22 93.887h299.699l25.138-40.783-25.138-40.783h-299.698z"></path>
                            <path fill='#23e5db' d="M1318.522 38.596v0c-45.72-14.369-93.752-21.658-142.762-21.658h-748.511c-84.346 0-165.764 21.683-235.441 62.713l3.118 51.726 49.245 15.865c54.16-31.895 117.452-48.739 183.073-48.739h748.511c38.159 0 75.52 5.657 111.029 16.829v0c44.91 14.111 86.594 37.205 120.526 66.792l66.163-57.68c-43.616-38.010-97.197-67.703-154.957-85.852z"></path>
                            <path fill='#3a77ff' d="M1473.479 124.453l-55.855 9.91-10.307 47.76c61.844 53.929 95.92 125.617 95.92 201.88 0 25.235-3.772 50.26-11.214 74.363-38.348 124.311-168.398 211.129-316.262 211.129h-448.812l25.121 40.783-25.121 40.783h448.812c190.107 0 357.303-111.638 406.613-271.498 9.572-31.009 14.423-63.162 14.423-95.559 0-98.044-43.805-190.216-123.317-259.551z"></path>
                        </g>
                    </svg>
                    <div className='d-flex flex-row btnInsideText' style={{ color: 'black' }} >
                        <span className='fa fa-plus mt-1'></span>
                        <span className='ml-2' style={{ fontWeight: 'bold' }} >Sell</span>
                    </div>
                </Link> :
                <Link className='d-flex flex-row noDeco' to='/sell' >
                    <svg width="104" height="48" viewBox="0 0 1603 768" >
                        <g>
                            <path fill='#fff' d="M434.442 16.944h718.82c202.72 0 367.057 164.337 367.057 367.058s-164.337 367.057-367.057 367.057h-718.82c-202.721 0-367.058-164.337-367.058-367.058s164.337-367.058 367.058-367.058z"></path>
                            <path fill='#ffce39' d="M427.241 669.489c-80.917 0-158.59-25.926-218.705-73.004l-0.016-0.014c-69.113-54.119-108.754-131.557-108.754-212.474 0-41.070 9.776-80.712 29.081-117.797 25.058-48.139 64.933-89.278 115.333-118.966l-52.379-67.581c-64.73 38.122-115.955 90.98-148.159 152.845-24.842 47.745-37.441 98.726-37.441 151.499 0 104.027 50.962 203.61 139.799 273.175h0.016c77.312 60.535 177.193 93.887 281.22 93.887h299.699l25.138-40.783-25.138-40.783h-299.698z"></path>
                            <path fill='#23e5db' d="M1318.522 38.596v0c-45.72-14.369-93.752-21.658-142.762-21.658h-748.511c-84.346 0-165.764 21.683-235.441 62.713l3.118 51.726 49.245 15.865c54.16-31.895 117.452-48.739 183.073-48.739h748.511c38.159 0 75.52 5.657 111.029 16.829v0c44.91 14.111 86.594 37.205 120.526 66.792l66.163-57.68c-43.616-38.010-97.197-67.703-154.957-85.852z"></path>
                            <path fill='#3a77ff' d="M1473.479 124.453l-55.855 9.91-10.307 47.76c61.844 53.929 95.92 125.617 95.92 201.88 0 25.235-3.772 50.26-11.214 74.363-38.348 124.311-168.398 211.129-316.262 211.129h-448.812l25.121 40.783-25.121 40.783h448.812c190.107 0 357.303-111.638 406.613-271.498 9.572-31.009 14.423-63.162 14.423-95.559 0-98.044-43.805-190.216-123.317-259.551z"></path>
                        </g>
                    </svg>
                    <div className='d-flex flex-row btnInsideText' style={{ color: 'black' }} >
                        <span className='fa fa-plus mt-1'></span>
                        <span className='ml-2' style={{ fontWeight: 'bold' }} >Sell</span>
                    </div>
                </Link>
        )
    }

    return (
        <div className='d-flex flex-row p-2 ml-auto mr-4'>
            {userId == 0 ?
                <button className='btnLogin d-flex align-self-center' onClick={toggleModal} >
                    Login
                </button> :
                <UncontrolledDropdown>
                    <DropdownToggle nav >
                        <img src={imageUrl + rs.img} style={{ width: 40, height: 40, borderRadius: 50 }} />
                    </DropdownToggle >
                    <DropdownMenu right>
                        <DropdownItem onClick={() => { localStorage.removeItem('userdata'); window.location.href = '/' }} >LogOut</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>}
            {sellBtn()}
            <Modal isOpen={isOpen} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal} >
                    {index !== 0 ? <span className='fa fa-arrow-left' onClick={() => { let ind = index; changeIndex(ind - 1) }} ></span> : <span></span>}
                </ModalHeader>
                <ModalBody className='d-flex flex-column btnGroupLogin' >
                    {indexing()}
                </ModalBody>
            </Modal>
        </div>
    )
}

export const fetchUserToStore = (email) => (dispatch) => {
    return fetch(`${baseUrl}users/${email}`, {
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
        .then(response => { dispatch({ type: Actions.ADD_LOGGED_USER, payload: response }); return response })
        .catch(error => { dispatch({ type: Actions.FAILED_LOGGED_USER, payload: error }); return error })
}

export default Login