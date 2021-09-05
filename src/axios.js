import axios from 'axios'

const port = 'https://water-tech-pools.herokuapp.com/'

export const baseURL = axios.create({
    baseURL: port
})