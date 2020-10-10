import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import { Card, CardBody, CardText, Table, } from 'reactstrap'
import { Pie, Line, HorizontalBar } from 'react-chartjs-2'
import { baseUrl } from '../baseUrl'
import { useDispatch } from 'react-redux';

const abortController = new AbortController()
const signal = abortController.signal

function Users(props) {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([])
    const [ads, setAds] = useState([])
    useEffect(() => {
        fetchUsers().then((res) => {
            setUsers(res)
        })
        fetchAds().then((res) => {
            setAds(res)
        })

    }, [fetchUsers, fetchAds])

    const countPremium = (userId) => {
        let count = 0
        ads.filter(item => item.user_id == userId && item.type == 'premium').map((item) => count++)
        return count
    }
    const countBasic = (userId) => {
        let count = 0
        ads.filter(item => item.user_id == userId && item.type == 'basic').map((item) => count++)
        return count
    }
    const countTotal = (userId) => {
        let count = 0
        ads.filter(item => item.user_id == userId).map((item) => count++)
        return count
    }

    return (
        <>
            <div className='mt-5' >
                <Table hover responsive  >
                    <tbody>
                        <tr className='adminAdTable' >
                            <th>UserId</th><th>Name</th><th>Email</th><th>created At</th><th>updated At</th>
                            <th>Premium Ads</th><th>Basic Ads</th><th>Total Ads</th>
                        </tr>
                        {users.map((item, index) => (
                            <tr key={index}
                                className='adminAdTableRow' >
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.created_at}</td>
                                <td>{item.updated_at}</td>
                                <td>{countPremium(item.id)}</td>
                                <td>{countBasic(item.id)}</td>
                                <td>{countTotal(item.id)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export const fetchUsers = () => {
    return fetch(`${baseUrl}users`, {
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

export const fetchAds = () => {
    return fetch(`${baseUrl}ads`, {
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

export default Users;
