/* setup .env file */
import dotenv from 'dotenv'
dotenv.config()

/* create server with express */
import express from 'express'
const server = express()

/* setup cors */
import cors from 'cors'
server.use(cors())

import bodyParser from 'body-parser'
server.use(bodyParser.json())

/* Push public folder */
server.use(express.static('public'))

/* Setup api config */
import apiConfig from './apis'
server.use('/apis', apiConfig)

/* Server on port */
server.listen(process.env.SV_PORT, () => {
    console.log(`SERVER on link => ${process.env.SV_HOST}:${process.env.SV_PORT}`);
})
