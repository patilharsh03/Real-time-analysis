const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000;

app.use(bodyParser.json())

const events = []

app.post('/events', (req, res) => {
    const event = req.body
    events.push(event)
    res.status(200).send('Event received')
})

app.get('/metrics', (req, res) => {
    const metrics = {
        opens_by_countries: {},
        opens_by_device: {},
        timeseries: [],
    };

    events.forEach(event => {
        const country = event.geo_ip.country;
        if (country) {
            if (!metrics.opens_by_countries[country]) {
                metrics.opens_by_countries[country] = 1
            } else {
                metrics.opens_by_countries[country]++
            }
        }

        const deviceType = event.user_agent_parsed.device_family
        if (deviceType) {
            if (!metrics.opens_by_device[deviceType]) {
                metrics.opens_by_device[deviceType] = 1
            } else {
                metrics.opens_by_device[deviceType]++
            }
        }
    })

    const currentTime = new Date()
    for (let i = 0; i < 6; i++) {
        const time = new Date(currentTime.getTime() - i * 60 * 1000)
        const totalOpens = Math.floor(Math.random() * 1000)
        metrics.timeseries.unshift({
            totalOpens,
            time: time.toLocaleString()
        })
    }

    res.json(metrics)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})