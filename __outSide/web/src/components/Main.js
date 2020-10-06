import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAds, fetchFav, fetchCategories, fetchSubCategories, fetchFeat, fetchLoc } from '../redux/Actions';
import Header from './Header';
import Home from './Home';
import { Switch, Route } from 'react-router-dom';
import AdDetail from './AdDetail';


function Main(props) {
    const {ads} = useSelector(state => state)
    const dispatch = useDispatch()
    // const {  } = useSelector(state => state.users)
    var res = window.localStorage.getItem('userdata')
    // console.log(JSON.parse(res).id)
    var rs = JSON.parse(res)
    rs = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rs)

    useEffect(() => {
        console.log(userId)
        dispatch(fetchAds())
        dispatch(fetchFav(userId))
        dispatch(fetchCategories())
        dispatch(fetchSubCategories())
        dispatch(fetchFeat(userId))
        dispatch(fetchLoc())
    }, [dispatch, userId])

    return (
        <>
            {/* <p style={{background: '#eee', margin: 0, padding: 10}} > Main</p> */}
            {/* <p>{JSON.stringify(st.favorites)}</p> */}
            <Header />
            <Switch>
                <Route path='/' component={() => <Home />} />
                <Route path='/item' component={() => <AdDetail />} />
            </Switch>
        </>
    )
}

export default Main