import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import { Card, CardBody, CardText, } from 'reactstrap'
import { baseUrl } from '../baseUrl';

function Dashboard(props) {

    useEffect(() => {
        console.log(fetchSome().then((res) => { return res }))
    }, [])

    return (
        <>
            <Card className='upperCard' style={{ width: '15%', margin: 20 }} >
                {/* <Card className='upperCard' ></Card> */}
                <CardBody>
                    <CardText style={{ color: 'white' }} >Users</CardText>
                </CardBody>
            </Card>
        </>
    )
}

export const fetchSome = () => {
    return fetch(`${baseUrl}ads`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Origin': 'http://127.0.0.1:3000/',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Request-Method': 'GET, POST, DELETE, PUT, OPTIONS'
        },
        referrerPolicy: 'no-referrer',
        referrer: 'http://127.0.0.1:3000/',
        redirect: 'follow'
    })
        .then(response => {
            console.log(response)
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
        // .then((response) => { console.log(response); return response.json() })
        .then(response => { return response })
        .catch(error => { return error })
}


export default Dashboard;
