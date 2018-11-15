import axios from 'axios'
import {baseURL} from './../endpoints.js'

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  },
  withCredentials: false,
  crossDomain: true,
  mode: 'no-cors',
  proxy: {
    host: 'https://operator.kubernetes.dev.intellecteu.com'
  },
  proxy: {
    host: 'https://operator.kubernetes.dev.intellecteu.com/api/v1*'
  }
})

instance.interceptors.request.use((config) => {
  console.log('Request: ', config)
  return config
}, (error) => {
  console.log('Request error:', error)
  return Promise.reject(error)
})

instance.interceptors.response.use(
  (response) => {return response},
  (error) => {
  //if (error.response.status === 500) {
    console.log(`Server responded with status ${error.response.status}. Error text: ${error.response.data.message}`)
  return Promise.reject(error.response)
})

export default instance