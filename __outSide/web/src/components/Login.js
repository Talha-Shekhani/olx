import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Carousel, CarouselItem, CarouselIndicators, CarouselCaption, Input, Button } from 'reactstrap'
import { baseUrl } from '../baseUrl'
import { Formik, Field } from 'formik'

function First({ next, previous, items, activeIndex, goToIndex, slides, changeIndex }) {
    return (
        <>
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous} >
                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
                {/* <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} /> */}
                <a className="carousel-control-prev" onClick={previous} style={{ cursor: 'pointer' }}><span className="fa fa-angle-left" style={{ fontSize: 30 }} aria-hidden="true"></span><span className="sr-only">Previous</span></a>
                <a className="carousel-control-next" onClick={next} style={{ cursor: 'pointer' }}><span className="fa fa-angle-right" style={{ fontSize: 30 }} aria-hidden="true"></span><span className="sr-only">Next</span></a>
            </Carousel>
            <button className='btns' >Continue with Phone</button>
            <button className='btns' >Continue with Facebook</button>
            <button className='btns' >Continue with Google</button>
            <button className='btns' onClick={() => changeIndex(1)} >Continue with Email</button>
        </>
    )

}

function Second({ email, changeEmail, changeIndex }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
            <img src={baseUrl + 'OLX_LOGO.png'} style={{ width: 50, height: 30, margin: 15 }} />
            <h4>Enter your Email</h4>
            {/* <Input name='email' type='email' placeholder='Email' value={email} chan />
            <button type='button' disabled className='nextInLogin' >Next</button> */}
            <Formik initialValues={{ email: '' }}
                validate={(values) => {
                    console.log('validate')
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
                        changeEmail(values.email)
                        changeIndex(2)
                        setSubmitting(false);
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched, validateField }) => (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }} >
                        <Input
                            type='email'
                            name="email"
                            onChange={(e) => {changeEmail(e.target.value); handleChange(e)}}
                            value={email}
                        />
                        {/* {errors.email && touched.email} */}
                        <button type='submit' disabled={errors.email} className='nextInLogin' >Next</button>
                    </form>
                )}
            </Formik>
        </div>
    )
}

function Third({ password, changePassword }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
            <img src={baseUrl + 'OLX_LOGO.png'} style={{ width: 50, height: 30, margin: 15 }} />
            <h4>Enter your Password</h4>
            <Formik initialValues={{ pswd: '' }}
                validate={(values) => {
                    console.log('validate')
                    const errors = {}
                    if (values.pswd === '') {
                        errors.pswd = 'Required'
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.pswd)) {
                        errors.pswd = 'Invalid email address'
                    }
                    return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        changePassword(values.pswd)
                        setSubmitting(false);
                    }, 400)
                }} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, touched, validateField }) => (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }} >
                        <Input
                            type='email'
                            name="email"
                            onChange={handleChange}
                            value={values.email}
                        />
                        {/* {errors.email && touched.email} */}
                        <button type='submit' disabled={errors.email} className='nextInLogin' >Next</button>
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
                <CarouselCaption captionText={item.caption} />
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
        console.log(email)
        setEmail(email)
    }

    const changePassword = (pswd) => {
        console.log(pswd)
        setEmail(pswd)
    }

    const indexing = () => {
        if (index === 0)
            return (<First items={items} previous={previous} next={next} activeIndex={activeIndex} goToIndex={goToIndex} slides={slides} changeIndex={changeIndex} />)
        else if (index === 1)
            return (<Second email={email} changeEmail={changeEmail} changeIndex={changeIndex} />)
        else if (index === 2)
            return (<Third password={password} changePassword={changePassword} />)
    }

    return (
        <div className='d-flex flex-row p-2 ml-auto mr-4'>
            <button className='btnLogin d-flex align-self-center' onClick={toggleModal} >
                Login
            </button>
            <div className='d-flex flex-row' onClick={() => console.log('object')} >
                <svg width="104" height="48" viewBox="0 0 1603 768" >
                    <g>
                        <path fill='#fff' d="M434.442 16.944h718.82c202.72 0 367.057 164.337 367.057 367.058s-164.337 367.057-367.057 367.057h-718.82c-202.721 0-367.058-164.337-367.058-367.058s164.337-367.058 367.058-367.058z"></path>
                        <path fill='#ffce32' d="M427.241 669.489c-80.917 0-158.59-25.926-218.705-73.004l-0.016-0.014c-69.113-54.119-108.754-131.557-108.754-212.474 0-41.070 9.776-80.712 29.081-117.797 25.058-48.139 64.933-89.278 115.333-118.966l-52.379-67.581c-64.73 38.122-115.955 90.98-148.159 152.845-24.842 47.745-37.441 98.726-37.441 151.499 0 104.027 50.962 203.61 139.799 273.175h0.016c77.312 60.535 177.193 93.887 281.22 93.887h299.699l25.138-40.783-25.138-40.783h-299.698z"></path>
                        <path fill='#23e5db' d="M1318.522 38.596v0c-45.72-14.369-93.752-21.658-142.762-21.658h-748.511c-84.346 0-165.764 21.683-235.441 62.713l3.118 51.726 49.245 15.865c54.16-31.895 117.452-48.739 183.073-48.739h748.511c38.159 0 75.52 5.657 111.029 16.829v0c44.91 14.111 86.594 37.205 120.526 66.792l66.163-57.68c-43.616-38.010-97.197-67.703-154.957-85.852z"></path>
                        <path fill='#3a77ff' d="M1473.479 124.453l-55.855 9.91-10.307 47.76c61.844 53.929 95.92 125.617 95.92 201.88 0 25.235-3.772 50.26-11.214 74.363-38.348 124.311-168.398 211.129-316.262 211.129h-448.812l25.121 40.783-25.121 40.783h448.812c190.107 0 357.303-111.638 406.613-271.498 9.572-31.009 14.423-63.162 14.423-95.559 0-98.044-43.805-190.216-123.317-259.551z"></path>
                    </g>
                </svg>
                <div className='d-flex flex-row btnInsideText' style={{ cursor: 'pointer' }} >
                    <span className='fa fa-plus mt-1'></span>
                    <span className='ml-2' style={{ fontWeight: 'bold' }} >Sell</span>
                </div>
            </div>
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

export default Login