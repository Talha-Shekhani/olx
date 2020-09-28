import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'reactstrap'
import { baseUrl } from '../baseUrl';


function Home(props) {
    const st = useSelector(state => state)
    const cat = useSelector(state => state.categories)
    const subCat = useSelector(state => state.subcategories)
    const ads = useSelector(state => state.ads)
    const fav = useSelector(state => state.favorites)
    const feat = useSelector(state => state.featured)
    const loc = useSelector(state => state.loc)
    const [userId, setUserId] = useState(1)
    const [search, setsearch] = useState('')

    const renderAds = (type) => {
        return (
            ads.ads
                .filter(item => type == 'premium' ? item.paid == 'y' : item.paid == '' && item.active === 'true' && (item.title.toLowerCase().includes(search) ||
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
                    }
                    {
                        if (userId != 0) feature = feat.featured
                            .filter(itm => item.category_id == itm.cat_id && itm.user_id == userId)
                            .map((item, index) => { return (item.cat_id) })
                    }
                    return (
                        <Card className='productCardColumn' key={index} >
                            {feat == item.category_id && item.type != 'premium' ? <div className='featuredTag' >
                                <p style={{ alignSelf: 'center' }}>Featured</p>
                            </div> : <></>}
                            {item.type == 'premium' ? <div className='premiumTag' >
                                <p style={{ alignSelf: 'center' }}>Premium</p>
                            </div> : <></>}
                            <div className='iconHBack' ><span className={fav == item.id ? 'fas fa-heart' : 'far fa-heart'} onClick={() => {
                                console.log('object')
                                // if (fav == item.id)
                                //     delFav(userId, item.id)
                                // else
                                //     this.props.postFav(userId, item.id)
                            }}
                                style={{ zIndex: 2 }} color={'red'} /></div>
                            <div key={index} onClick={() => console.log('object')
                                // { adId: item.id, userId: item.user_id, catId: item.category_id }
                            } >
                                <div style={{ width: '98%', height: '62%', margin: 2 }}>
                                    <img style={{ alignSelf: 'center', width: 50, height: 50, paddingVertical: 5 }}
                                        // resizeMethod="scale"
                                        // resizeMode="contain"
                                        source={`${baseUrl + item.img1}`}
                                    />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold', fontSize: 16, marginTop: 5, }}> Rs {item.price}</p>
                                    <p numberOfLines={1} > {item.title}</p>
                                    <p style={{ marginTop: 18 }} >
                                        <span name="map-marker" size={10} />
                                        <p style={{ fontSize: 10 }}>
                                            {loc.loc.filter(itm => itm.id == item.area_id).map((itm, index) => {
                                                return (<p key={index}>  {itm.area}, {itm.city}</p>)
                                            })}
                                        </p>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )
                })
        )
    }

    return (
        <>
            {/* {JSON.stringify(st)} */}
            {renderAds('premium')}
        </>
    )
}

export default Home;
