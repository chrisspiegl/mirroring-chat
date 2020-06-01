import Vue from 'vue'
import axios from 'axios'

// Inspired by https://blog.sqreen.com/authentication-best-practices-vue/


// TODO: implement unexpected "unauthorized response"
// axios.interceptors.response.use(undefined, (err) => new Promise((resolve, reject) => {
//   // eslint-disable-next-line no-underscore-dangle
//   if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
//     // if you ever get an unauthorized, logout the user
//     this.$store.dispatch('AUTH_LOGOUT')
//     // you can also redirect to /login if needed !
//     resolve()
//   }
//   throw err
// }))

axios.interceptors.request.use((config) => {
  // before a request is made
  // NProgress.start()
  Vue.$log.debug('axios - interceptors.request ')
  return config
})

axios.interceptors.response.use((response) => {
  // before a response is returned
  // NProgress.done()
  Vue.$log.debug('axios - interceptors.response')
  return response
})

export const apiCall = ({
  url,
  method,
  data = {},
}) => new Promise((resolve, reject) => {
  if (!url) throw new Error('apiCall - url must be defined in options object')
  const urlCall = `/api${url}`
  let methodCall = method || 'GET'
  methodCall = methodCall.toLowerCase()

  const options = {
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem('tokenUser')}`,
    // },
  }

  const call = (['post', 'put', 'patch'].includes(methodCall)) ? axios[methodCall](urlCall, data, options) : axios[methodCall](urlCall, options)
  call.then((resp) => {
    Vue.$log.debug(`Api Call Success for ${methodCall}:${urlCall}`, resp)
    if (resp.data) return resolve(resp.data)
    return resolve({})
  })
    .catch((err) => {
      Vue.$log.debug(`Api Call Error for ${methodCall}:${urlCall}`, err)
      return reject(err)
    })
})

export const setDefaultAuthHeaders = (tokenUser) => {
  axios.defaults.headers.common.Authorization = `Bearer ${tokenUser}`
}
