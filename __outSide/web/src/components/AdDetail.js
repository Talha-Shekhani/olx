import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from './Login';
import { baseUrl, imageUrl } from '../baseUrl';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { delFav, postFav } from '../redux/Actions';

function AdDetail(props) {
    const dispatch = useDispatch()
    const { ads, loc } = useSelector(state => state)
    const cat = useSelector(state => state.categories)
    const subCat = useSelector(state => state.subcategories)
    const fav = useSelector(state => state.favorites)
    var res = window.localStorage.getItem('userdata')
    var rs = JSON.parse(res)
    rs = rs !== null ? rs.id : 0
    const [userId, setUserId] = useState(rs)
    const { adId } = props
    const [img, setImg] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [ad, setAd] = useState({})

    useEffect(() => {
        setAd(ads.ads.filter(item => item.id == adId)[0])
        if (ad != undefined) {
            if (ad.img1 != undefined && ad.img1 != '') img.push({ src: imageUrl + ad.img1, altText: ad.title })
            if (ad.img2 != undefined && ad.img2 != '') img.push({ src: imageUrl + ad.img2, altText: ad.title })
            // setImg([...img, { src: imageUrl + ad.img2, altText: ad.title }])
            if (ad.img3 != undefined && ad.img3 != '') img.push({ src: imageUrl + ad.img3, altText: ad.title })
            setImg([...img])
        }
    }, [ad])

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === img.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? img.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const displayRightSide = () => {
        if (ad != undefined && Object.keys(ad).length != 0) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD'
            })
            var favrite = ''
            if (userId != 0) favrite = fav.favorites
                .filter(itm => itm.ad_id == ad.id && itm.user_id == userId)
                .map((item, index) => { return (item.ad_id) })
            var dat = new Date(ad.created_date)
            return (
                <Card className='margin-20' >
                    <CardBody>
                        <div className='d-flex flex-column'>
                            <h4 className='font-weight-bold' >{formatter.format(ad.price)}</h4>
                            <h5 className='text-secondary'>{ad.title}</h5>
                            <div>
                                <span className={favrite == ad.id ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={() => {
                                    // console.log('object')
                                    if (favrite == ad.id)
                                        dispatch(delFav(userId, ad.id))
                                    else
                                        dispatch(postFav(userId, ad.id))
                                }}
                                    style={{ zIndex: 2, color: 'red', fontSize: 22 }} />
                            </div>
                        </div>
                        <div className='d-flex justify-content-between mt-4 text-secondary' >
                            {loc.loc
                                .filter(itm => itm.id == ad.area_id)
                                .map((itm, index) => {
                                    return (<small className='mb-0' key={index}>  {itm.area}, {itm.city}</small>)
                                })}
                            <small className='mb-0'>{dat.toUTCString().slice(5, 12)}</small>
                        </div>
                    </CardBody>
                </Card>
            )
        }
        else return (<></>)
    }

    if (ad != undefined)
        return (
            <>
                {JSON.stringify(ad)}
                <div className='float-left' style={{ width: '65%' }} >
                    <Carousel activeIndex={activeIndex} next={next} previous={previous}
                        className='adDetailSlider' >
                        <CarouselIndicators items={img} activeIndex={activeIndex} onClickHandler={goToIndex} />
                        {img.map((item, index) => {
                            return (
                                <CarouselItem
                                    onExiting={() => setAnimating(true)}
                                    onExited={() => setAnimating(false)}
                                    key={index} >
                                    <img src={item.src} alt={item.altText} style={{ objectFit: 'contain', width: '100%', height: 350, backgroundColor: '#' }} />
                                </CarouselItem>
                            )
                        })}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                    </Carousel>
                    <Card className='margin-20' >
                        <CardBody>
                            <h5>Description</h5>
                            <>{ad.description}</>
                        </CardBody>
                    </Card>
                </div>
                <div className='float-right' style={{ width: '35%' }} >
                    {displayRightSide()}
                </div>
            </>
        )
    else return (<></>)

}

export default AdDetail
