import app from './src/app.js'

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`)
})