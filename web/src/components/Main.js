import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAds, fetchFav } from '../redux/Actions';
import Header from './Header';
import { Button } from 'reactstrap';


function Main(props) {
    const st = useSelector(state => state)
    const dispatch = useDispatch()
    const [userId, setUserId] = useState(0)

    useEffect(() => {
        dispatch(fetchAds())
        dispatch(fetchFav(userId))
    }, [])

    return (
        <>
            <p>Main</p>
            <Header />
        </>
    )
}

export default Main