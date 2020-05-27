import Vue from 'vue'
import axios from 'axios'

const apiCall = ({
  url,
  method,
  data = {},
}) => new Promise((resolve, reject) => {
  if (!url) throw new Error('apiCall - url must be defined in options object')
  const urlCall = `/api${url}`
  let methodCall = method || 'GET'
  methodCall = methodCall.toLowerCase()

  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('tokenUser')}`,
    },
    data,
  }

  axios[methodCall](urlCall, options).then((resp) => {
    Vue.$log.debug(`Api Call Success for ${methodCall}:${urlCall}`, resp)
    // Each Api Call may receive back a jwt token and should auto update the local storage token
    if (resp.data && resp.data.tokenUser) {
      Vue.$log.debug('Setting user token in local storage (api request contained new token)')
      localStorage.setItem('tokenUser', resp.data.tokenUser)
    }
    if (resp.data) return resolve(resp.data)
    return resolve()
  }).catch((err) => {
    Vue.$log.debug(`Api Call Error for ${methodCall}:${urlCall}`, err)
    return reject(err)
  })
})

export default apiCall
