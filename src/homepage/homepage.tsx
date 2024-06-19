import React, { useState, useEffect } from 'react'
import { Button, Typography, Grid } from '@mui/material'
import axios from 'axios';

import './homepage.css'
import { ProductAdded } from '../components/productAdded/productAdded';

chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  chrome.storage.local.set({ url: tabs[0].url })
})
const BASE_URL = process.env.REACT_APP_BASE_URL
function HomePage() {
  const [URL, setURL] = useState('')
  const [button, setButton] = useState('')
  const [isLoading, setLoading] = useState(false)
  chrome.storage.local.get(["url"]).then(data => {
    setURL(data.url)
    setLoading(true)
  })

  const CheckAdded = async () => {
    if (!URL) return;
    if (!URL.includes('/dp/')) {
      return setButton((<Typography variant='h5'>Invalid URL</Typography> as any))
    }
    const userId = await chrome.storage.local.get("id")
    const addedProducts = await axios.get(`http://localhost:5000/info/${userId.id}`)
    if (addedProducts.data === null) {
      return setButton((<Button variant='outlined' onClick={(() => AddProduct())}> + Add to watchlist</Button> as any))
    }
    const index = URL?.split('/')?.filter(n => n).indexOf('dp')
    const productID = URL?.split('/')?.filter(n => n)[index + 1]
    if (!productID) return
    const addCheck = addedProducts.data.products.find(o => o.productId === productID)
    if (!addCheck) {
      setButton((<Button variant='outlined' onClick={(() => AddProduct())}> + Add to watchlist</Button> as any))
    } else {
      setButton((<ProductAdded userID={userId.id} productID={productID}/> as any))
    }
  }

  const AddProduct = async () => {
    const userId = await chrome.storage.local.get("id")
    const userInfo = await axios.get(`${BASE_URL}/user/${userId.id}`)
    console.log(userId, userInfo)
    if (userInfo.data.emailId.length === 0) {
      chrome.notifications.create('notification', {
        title: 'Add E-Mail for regular price updates',
        message: 'Add an E-Mail id to get notified when your desired product is at its lowest price',
        iconUrl: chrome.runtime.getURL('./public/icons/icon.png'),
        type: 'basic',
        priority: 2,
        requireInteraction: true
      }, () => { });
    }
    setButton((<Button variant='outlined'>Added to watchlist</Button> as any))
    await axios.get(`${BASE_URL}/add/${userId.id}/${URL}`)
  }
  const RemoveProduct = async () => {
    if (!URL) return
    const index = URL?.split('/')?.filter(n => n).indexOf('dp')
    const productID = URL?.split('/')?.filter(n => n)[index + 1]
    const userId = await chrome.storage.local.get("id")
    await axios.get(`http://localhost:5000/remove/${userId.id}/${productID}`)
    setButton((<Button variant='outlined'>Removed from watchlist</Button> as any))
  }
  useEffect(() => {
    CheckAdded()
  }, [URL])
  return (
    <Grid>
      {isLoading ? (
        <Grid item className='container'>
          {button}
        </Grid>
      ) : (
        <h4>Loading</h4>
      )}
    </Grid>
  )
}

export default HomePage