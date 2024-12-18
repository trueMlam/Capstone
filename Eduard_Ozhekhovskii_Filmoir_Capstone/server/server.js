require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  next()
})

const foldersRoutes = require("./routes/folders")
const moviesRoutes = require("./routes/movies")
app.use("/folders", foldersRoutes)
app.use("/movies", moviesRoutes)
app.use("/", moviesRoutes)

app.get("/", (req, res) => {
  res.send("✅ filmoir is running!")
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: "❌ err 500!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ filmoir running on ${PORT}`)
})