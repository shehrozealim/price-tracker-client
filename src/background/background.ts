/*global chrome*/
import randomize from 'randomatic';
import axios from 'axios';
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Installed extension')
  const userId = randomize('Aa0', 16)
  chrome.storage.local.set({ id: userId })
  console.log(userId)
  await axios.post(`${process.env.REACT_APP_BASE_URL}/create/${userId}`)
  console.log('called')
})
