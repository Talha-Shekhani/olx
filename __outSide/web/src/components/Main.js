import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAds, fetchFav, fetchCategories, fetchSubCategories, fetchFeat, fetchLoc } from '../redux/Actions';
import Header from './Header';
import Home from './Home';
import { Switch, Route, useParams } from 'react-router-dom';
import AdDetail from './AdDetail';

function Main(props) {
    const { ads } = useSelector(state => state)
    const dispatch = useDispatch()
    var res = window.localStorage.getItem('userdata')
    var rs = JSON.parse(res)
    rs = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rs)

    useEffect(() => {
        dispatch(fetchAds())
        dispatch(fetchFav(userId))
        dispatch(fetchCategories())
        dispatch(fetchSubCategories())
        dispatch(fetchFeat(userId))
        dispatch(fetchLoc())
    }, [dispatch, userId])

    const itemDetail = ({match}) => {
        var { itemId } = match.params
        // var adId = itemId.slice(itemId.toString().lastIndexOf('-') + 1)
        return (
            <AdDetail adId={itemId} />
        )
    }

    return (
        <>
            {/* <p style={{background: '#eee', margin: 0, padding: 10}} > Main</p> */}
            {/* <p>{JSON.stringify(ads.ads)}</p> */}
            <Header />
            <img src='/assets/main_pic.jpg' style={{ width: '100%', height: 'auto' }} />
            <Switch>
                <Route exact path='/' component={() => <Home />} />
                <Route path='/item/:itemId' component={itemDetail} />
            </Switch>
        </>
    )
}

export default Main