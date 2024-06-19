import { Grid, Typography, Button } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material'

import './productAdded.css';

export function ProductAdded({ userID, productID }) {
    
    const [productData, setProductData] = useState([])
    const [userData, setUserData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const fetchData = async () => {
        await fetch(`${process.env.REACT_APP_BASE_URL}/info/${userID}`).then(res => res.json())
            .then(data => {
                setProductData(data.products.filter(n => n.productId === productID))
                setUserData(data)
                setLoading(true)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])
    if (productData.length === 0) return;
    const dates = (productData as any)[0].priceHistory.map(res => {
        const epochData = new Date(res.date)
        const day = epochData.getDate()
        const month = epochData.getMonth() + 1
        const year = epochData.getFullYear()
        const hour = epochData.getHours()
        const minutes = epochData.getMinutes()
        const date = `${day}-${month}-${year} ${hour}:${minutes}`
        return date
    })
    const currency = productData[0].price.substring(0,1)
    const prices = (productData as any)[0].priceHistory.map(res => {
        const price = parseInt(res.price.substring(1).split(",").join(""))
        return price
    })
    const minValue = Math.min(...prices)
    const maxValue = Math.max(...prices)
    return (
        <div>
            {isLoading ? (
                <Grid container>
                    <Grid item xs={6}>
                        <Grid item container>
                            <KeyboardDoubleArrowUp sx={{ color: 'red' }} />
                            <Typography>Highest Price</Typography>
                            <Typography marginLeft={1}>{currency+maxValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item container>
                            <KeyboardDoubleArrowDown sx={{ color: 'green' }} />
                            <Typography>Lowest Price</Typography>
                            <Typography marginLeft={1}>{currency+minValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <LineChart
                            slotProps={{ popper: { placement: 'auto-start' } }}
                            height={300}
                            margin={{ left: 70 }}
                            width={300}
                            xAxis={[{ data: dates, scaleType: 'point' }]}
                            yAxis={[{ min: minValue*0.9, scaleType: 'linear' }]}
                            series={[{ data: prices }]}
                        />
                    </Grid>
                    <Grid item className='buttons'>
                        <Button variant='outlined' className='view-all-button'>View all watched products</Button>
                        <Button variant='outlined' className='remove-button' color='warning'>Remove from watchlist</Button>
                    </Grid>
                </Grid>
            ) : (
                <h3></h3>
            )}
        </div>

    )
}