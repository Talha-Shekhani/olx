import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux'
// import logo from './logo.svg';
import { Table, Button } from 'reactstrap'
import { Formik } from 'formik'
import { baseUrl } from '../baseUrl'

const required = (val) => val && val.length
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const minLength = (len) => (val) => (val) && (val.length >= len)
const isNumber = (val) => !isNaN(Number(val))
const validEmail = (val) => /^[A-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(val)

function Ads(rops) {
    const [ads, setAds] = useState([])
    const [selectedAd, setSelectedAd] = useState(0)
    const store = useStore()

    useEffect(() => {
        // console.log(store.getState())
        fetchTransactionDetails()
            .then((res) => {
                setAds(res)
            })
    }, [fetchTransactionDetails])



    const handleChange = (e) => {
        console.log(selectedAd, e.target.value)
        putPaid(selectedAd, e.target.value)
            .then((res) => {
                if (res.success) {
                    fetchTransactionDetails()
                        .then((res) => {
                            setAds(res)
                            setSelectedAd(0)
                        })
                    console.log(res)
                }
            })
    }

    return (
        <>
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
            <div className='mt-5' >
                <Table hover responsive  >
                    <tbody>
                        <tr className='adminAdTable' >
                            <th>UserId</th><th>Name</th><th>Ad Id</th><th>Ad Type</th><th>Paid?</th>
                            <th>Transaction Id</th><th>Transaction Date</th><th>Payment Method</th>
                            <th>Bank Name</th>
                            {/* <th>Actions</th> */}
                        </tr>
                        {ads.filter(item => item.type != 'basic').map((item, index) => (
                            <tr key={index} onClick={() => setSelectedAd(item.ad_id)}
                                className='adminAdTableRow' >
                                <td>{item.user_id}</td>
                                <td>{item.name}</td>
                                <td>{item.ad_id}</td>
                                <td>{item.type}</td>
                                <td className='selecter'>
                                    {selectedAd == item.ad_id ?
                                        <select onChange={handleChange} >
                                            <option>{item.paid}</option>
                                            {item.paid == 'y' ? <option>n</option> : <option>y</option>}
                                        </select> : item.paid}
                                </td>
                                <td>{item.tId}</td>
                                <td>{item.date.slice(0, 10)}</td>
                                <td>{item.method}</td>
                                <td>{item.bank_name}</td>
                                {/* <td></td> */}
                                {/* <td>
                                <Button className='btn-primary' ><i></i></Button>
                            </td> */}
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

export default Ads