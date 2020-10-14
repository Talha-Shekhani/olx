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

function Reviews() {
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        fetchReviews().then((res) => {
            setReviews(res)
        })
    }, [fetchReviews])

    return (
        <>
            <div className='mt-5' >
                <Table hover responsive  >
                    <tbody>
                        <tr className='adminAdTable' >
                            <th>UserId</th><th>Ad Id</th><th>Rating</th><th>Review</th><th>Date Time</th>
                        </tr>
                        {reviews.map((item, index) => (
                            <tr key={index} >
                                <td>{item.user_id}</td>
                                <td>{item.ad_id}</td>
                                <td>{item.rating}</td>
                                <td>{item.review}</td>
                                <td>{item.date_time.replace('T', ' ').split('.')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export const fetchReviews = () => {
    return fetch(`${baseUrl}review`, {
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


export default Reviews