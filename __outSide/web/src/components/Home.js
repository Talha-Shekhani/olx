import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, CardImg } from 'reactstrap'
import { delFav, postFav } from '../redux/Actions';
import { baseUrl, imageUrl } from '../baseUrl';


function Home(props) {
    const dispatch = useDispatch()
    const cat = useSelector(state => state.categories)
    const subCat = useSelector(state => state.subcategories)
    const ads = useSelector(state => state.ads)
    const fav = useSelector(state => state.favorites)
    const feat = useSelector(state => state.featured)
    const { loggedInUser, loggedInUserId } = useSelector(state => state.users)
    var res = window.localStorage.getItem('userdata')
    var rs = JSON.parse(res)
    rs = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rs)
    const loc = useSelector(state => state.loc)
    const [search, setsearch] = useState('')

    const renderAds = (type) => {
        return (
            ads.ads
                .filter(item => type == 'premium' ? item.paid == 'y' : item.paid == '' && item.active == 'true' && (item.title.toLowerCase().includes(search) ||
                    cat.categories
                        .filter(el => el.title.toLowerCase().includes(search))
                        .find(el => el.cat_id == item.category_id) != undefined)
                )
                .map((item, index) => {
                    let favrite = '', feature = ''
                    {
                        if (userId != 0) favrite = fav.favorites
                            .filter(itm => item.id == itm.ad_id && itm.user_id == userId)
                            .map((item, index) => { return (item.ad_id) })
                        if (userId !== 0) feature = feat.featured
                            .filter(itm => item.category_id == itm.cat_id && itm.user_id == userId)
                            .map((item, index) => { return (item.cat_id) })
                    }
                    return (
                        <div className='col-12 col-md-4 col-lg-3 col-xl-3 my-2' key={index} >
                            <Card className='productCardColumn' key={index} >
                                {feature == item.category_id && item.type != 'premium' ? <div className='featuredTag' >
                                    <p style={{ alignSelf: 'center' }} className='m-0 pl-2' >Featured</p>
                                </div> : <></>}
                                {item.type == 'premium' ? <div className='premiumTag' >
                                    <p style={{ alignSelf: 'center' }} className='m-0 pl-2'>Premium</p>
                                </div> : <></>}
                                <div className='iconHBack'>
                                    <span className={favrite == item.id ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={() => {
                                        // console.log('object')
                                        if (favrite == item.id)
                                            dispatch(delFav(userId, item.id))
                                        else
                                            dispatch(postFav(userId, item.id))
                                    }}
                                        style={{ zIndex: 2, color: 'red', fontSize: 22 }} /></div>
                                <CardImg src={`${imageUrl + item.img1}`} top className='productCardImage py-2' />
                                <CardBody className='productCardBody d-flex flex-column p-0 pl-3' >
                                    <p style={{ fontWeight: "bold", margin: 0 }}> Rs {item.price}</p>
                                    <p className='productTitle' >{item.title}</p>
                                    <div className='productAddress d-flex mt-auto mb-2' >
                                        <span className="fa fa-map-marker" style={{ color: 'grey', fontSize: 12, alignSelf: 'center' }}></span>
                                        <div style={{ fontSize: 12, color: 'grey' }}>
                                            {loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                                                return (<p key={index} className='mb-0 ml-1' >  {itm.area}, {itm.city}</p>)
                                            })}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        // <Card className='productCardColumn' key={index} >
                        //     {feat === item.category_id && item.type != 'premium' ? <div className='featuredTag' >
                        //         <p style={{ alignSelf: 'center' }}>Featured</p>
                        //     </div> : <></>}
                        //     {item.type === 'premium' ? <div className='premiumTag' >
                        //         <p style={{ alignSelf: 'center' }}>Premium</p>
                        //     </div> : <></>}
                        //     <div className='iconHBack' ><span className={fav === item.id ? 'fas fa-heart' : 'far fa-heart'} onClick={() => {
                        //         console.log('object')
                        //         // if (fav === item.id)
                        //         //     delFav(userId, item.id)
                        //         // else
                        //         //     this.props.postFav(userId, item.id)
                        //     }}
                        //         style={{ zIndex: 2 }} color={'red'} /></div>
                        //     <span key={index} onClick={() => console.log('object')
                        //         // { adId: item.id, userId: item.user_id, catId: item.category_id }
                        //     } className='cardTouch' >
                        //         <div style={{ width: '98%', height: '62%', margin: 2 }}>
                        //             <img style={{ alignSelf: 'center', width: 50, height: 50, paddingVertical: 5 }}
                        //                 // resizeMethod="scale"
                        //                 // resizeMode="contain"
                        //                 source={`${baseUrl + item.img1}`}
                        //             />
                        //         </div>
                        //         <div>
                        //             <p style={{ fontWeight: 'bold', fontSize: 16, marginTop: 5, }}> Rs {item.price}</p>
                        //             <p numberOfLines={1} > {item.title}</p>
                        //             <p style={{ marginTop: 18 }} >
                        //                 <span name="map-marker" size={10} />
                        //                 <p style={{ fontSize: 10 }}>
                        //                     {loc.loc.filter(itm => itm.id === item.area_id).map((itm, index) => {
                        //                         return (<p key={index}>  {itm.area}, {itm.city}</p>)
                        //                     })}
                        //                 </p>
                        //             </p>
                        //         </div>
                        //     </span>
                        // </Card>
                    )
                })
        )
    }

    return (
        <>
            {/* {JSON.stringify(st)} */}
            <div className='cardColumn d-flex flex-row flex-wrap mx-5 my-3 justify-content-start' >
                {renderAds('premium')}
                {renderAds('basic')}
            </div>
        </>
    )
}

export default Home;
