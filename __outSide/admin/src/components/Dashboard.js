import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import { Card, CardBody, CardText, FormGroup, Label, Col, Input, } from 'reactstrap'
import { Pie, Line, HorizontalBar } from 'react-chartjs-2'
import { baseUrl } from '../baseUrl'

const abortController = new AbortController()
const signal = abortController.signal

function Dashboard(props) {
    const [totalCounts, setTotalCounts] = useState({})
    const [ads, setAds] = useState([])
    const [revenueByMethod, setRevenueByMethod] = useState([])
    const [revenueByBank, setRevenueByBank] = useState([])
    const [allAds, setAllAds] = useState([])
    const [totalPremium, setTotalPremium] = useState(0)
    const [totalBasic, setTotalBasic] = useState(0)
    const dat = new Date().toISOString().split('T')[0]
    const [startDate, setStartDate] = useState(dat)
    const [endDate, setEndDate] = useState(dat)
    const [premiumExp, setPremiumExp] = useState([])

    useEffect(() => {
        fetchSome().then((res) => {
            setTotalCounts(res)
        })
        fetchAds().then((res) => {
            setAds(res)
        })
        fetchRevenue().then((res) => {
            setRevenueByMethod(res.byMethod)
            setRevenueByBank(res.byBank)
        })
        fetchAllAds().then((res) => {
            countBasic(res)
            countPremium(res)
            setAllAds(res)
        })
    }, [fetchAds, fetchRevenue, fetchSome, fetchAllAds])

    const countPremium = (ads) => {
        let count = 0
        ads.filter(item => item.type == 'premium').map((item) => count++)
        setTotalPremium(count)
    }
    const countBasic = (ads) => {
        let count = 0
        ads.filter(item => item.type == 'basic').map((item) => count++)
        setTotalBasic(count)
    }

    const dateObject = () => {
        let st = new Date(startDate)
        let et = new Date(endDate)
        let dat = []
        for (let i = st; i < et; i + 5) {
            dat.push(i)
            console.log('i', i)
        }
        console.log(dat)
        return dat
    }

    return (
        <>
            <div className='magicCards d-flex flex-row col flex-wrap col-12 justify-content-start justify-content-lg-around my-4' >
                <Card className='upperCard col-md-4 col-lg-3 col-xl-2 m-1 mx-3 mx-md-5 mx-lg-3 mx-xl-5'
                    style={{ background: `linear-gradient(to right, #ff3636, #ff9436)` }} >
                    <CardBody>
                        <CardText style={{ color: 'white', fontSize: 20 }} >Total Users: <span style={{ fontWeight: 'bold' }}>{totalCounts.tUsers}</span> </CardText>
                    </CardBody>
                </Card>
                <Card className='upperCard col-md-4 col-lg-3 col-xl-2 m-1 mx-3 mx-md-5 mx-lg-3 mx-xl-5'
                    style={{ background: `linear-gradient(to right, #ffee36, #7cff36)` }}  >
                    <CardBody>
                        <CardText style={{ color: 'white', fontSize: 20 }} >Total Ads: <span style={{ fontWeight: 'bold' }}>{totalCounts.tAds}</span> </CardText>
                    </CardBody>
                </Card>
                <Card className='upperCard col-md-4 col-lg-3 col-xl-2 m-1 mx-3 mx-md-5 mx-lg-3 mx-xl-5'
                    style={{ background: `linear-gradient(to right, #36ffee, #3676ff)` }}  >
                    <CardBody>
                        <CardText style={{ color: 'white', fontSize: 18 }} >Premium Ads: <span style={{ fontWeight: 'bold' }}>{totalPremium}</span> </CardText>
                    </CardBody>
                </Card>
                <Card className='upperCard col-md-4 col-lg-3 col-xl-2 m-1 mx-3 mx-md-5 mx-lg-3 mx-xl-5'
                    style={{ background: `linear-gradient(to right, #cd36ff, #ff3697)` }} >
                    < CardBody >
                        <CardText style={{ color: 'white', fontSize: 20 }} >Basic Ads: <span style={{ fontWeight: 'bold' }}>{totalBasic}</span> </CardText>
                    </CardBody>
                </Card>
            </div>
            <div className='d-flex flex-row col flex-wrap col-12 justify-content-around my-4'>
                <Card className='col-12 col-md-12 col-lg-5 col-xl-5 mx-1 mx-md-0 ml-lg-0 my-1' >
                    <CardBody>
                        {/* <p>{JSON.stringify(ads.map((itm) => itm.tAds))}</p> */}
                        <Line data={{
                            datasets: [{
                                label: 'Ads Posted',
                                pointHitRadius: 10,
                                borderColor: ['#999'],
                                borderWidth: 1,
                                backgroundColor: ['#B21F00', '#C9DE00', '#2FDE00', '#00A6B4', '#6800B4'],
                                hoverBackgroundColor: ['#501800', '#4B5000', '#175000', '#003350', '#35014F'],
                                data: ads.map((itm) => itm.tAds),
                                fill: false,
                            }],
                            labels: ads.map((itm) => itm.date.slice(0, 10)),
                        }} />
                    </CardBody>
                </Card>
                <Card className='col-12 col-md-12 col-lg-5 col-xl-5 mx-1 mx-md-0 ml-lg-0 my-1' >
                    <CardBody>
                        {/* <p>{JSON.stringify(revenueByMethod.map((itm) => itm))}</p> */}
                        <Pie data={{
                            datasets: [{
                                label: 'Revenue By Method',
                                pointHitRadius: 5,
                                borderColor: ['#9b36ff', '#35c700'],
                                backgroundColor: ['#9b36ff', '#35c700'],
                                hoverBackgroundColor: ['#630094', '#279400'],
                                hoverBorderColor: ['#630094', '#279400'],
                                hoverBorderWidth: 6,
                                data: revenueByMethod.map((itm) => itm.revenue),
                                fill: false
                            }],
                            labels: revenueByMethod.map((itm) => itm.method),
                        }} />
                    </CardBody>
                </Card>
                <Card className='col-12 col-md-12 col-lg-5 col-xl-5 mx-1 mx-md-0 ml-lg-0 my-1' >
                    <CardBody>
                        {/* <p>{JSON.stringify(revenueByMethod.map((itm) => itm))}</p> */}
                        <HorizontalBar data={{
                            datasets: [{
                                label: 'Revenue By Bank',
                                pointHitRadius: 5,
                                borderColor: ['#9b36ff', '#35c700'],
                                backgroundColor: ['#9b36ff', '#35c700'],
                                hoverBackgroundColor: ['#630094', '#279400'],
                                hoverBorderColor: ['#630094', '#279400'],
                                hoverBorderWidth: 6,
                                data: revenueByBank.map((itm) => itm.revenue),
                                fill: false
                            }],
                            labels: revenueByBank.map((itm) => itm.bankName),
                        }}  />
                    </CardBody>
                </Card>
                <Card className='col-12 col-md-12 col-lg-5 col-xl-5 mx-1 mx-md-0 ml-lg-0 my-1' >
                    <CardBody>
                        <FormGroup row className='col-12'>
                            <Col sm={6} >
                                <Label>Start Date:</Label>
                                <Input type="date" name="select" id="start" placeholder='Start Date' max={dat}
                                    value={startDate} onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setEndDate(dat);
                                        fetchPremiumExpiry(startDate, endDate).then((res) => { console.log(res); setPremiumExp(res) })
                                    }} />
                            </Col>
                            <Col sm={6} >
                                <Label>End Date:</Label>
                                <Input type="date" name="select" id="start" placeholder='End Date' min={startDate}
                                    value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <Line data={{
                            datasets: [{
                                label: 'Premium ads Expiration',
                                pointHitRadius: 10,
                                borderColor: ['#999'],
                                borderWidth: 1,
                                backgroundColor: ['#B21F00', '#C9DE00', '#2FDE00', '#00A6B4', '#6800B4'],
                                hoverBackgroundColor: ['#501800', '#4B5000', '#175000', '#003350', '#35014F'],
                                data: premiumExp.map((itm) => itm.tPAds),
                                fill: false,
                            }],
                            labels: premiumExp.map((itm) => itm.date.split('T')[0]),
                        }} />
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export const fetchSome = () => {
    return fetch(`${baseUrl}admin`, {
        signal: signal,
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
    return fetch(`${baseUrl}admin/totalAds`, {
        signal: signal,
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

export const fetchRevenue = () => {
    return fetch(`${baseUrl}admin/revenue`, {
        signal: signal,
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

export const fetchAllAds = () => {
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

export const fetchPremiumExpiry = (startDate, endDate) => {
    return fetch(`${baseUrl}admin/${startDate}/${endDate}`, {
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

export default Dashboard;
