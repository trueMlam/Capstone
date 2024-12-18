const express = require("express")
const r = express.Router()
const { connectToDB } = require("../db")
const ax = require("axios")
const { ObjectId } = require("mongodb")

const u = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\s]*\/[\s]*/g, "+") 
      .replace(/[\s]*&[\s]*/g, "+") 
      .replace(/[()]/g, "") 
      .replace(/[^a-z0-9+.-]/g, ""); 
  }

r.post("/", async (req, res) => {
  const { name, emoji } = req.body
  if (!name) return res.status(400).json({ error: "😢 name is required" })

  const url = u(name)

  try {
    const db = await connectToDB()
    const f = await db.collection("folders").findOne({ url })
    if (f) return res.status(400).json({ error: "😢 folder already exists" })

    await db.collection("folders").insertOne({ name, url, emoji: emoji || "📁", isDefault: false })
    res.status(201).json({ message: "folder created!" })
  } catch (err) {
    console.error("❌ failed to create 🗂️", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.get("/", async (req, res) => {
  try {
    const db = await connectToDB()
    const folders = await db.collection("folders").find().toArray()
    res.status(200).json(folders)
  } catch (err) {
    console.error("❌ failed to get 🗂️", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const db = await connectToDB()
    const folder = await db.collection("folders").findOne({ url: id })

    if (!folder) return res.status(404).json({ error: "😢 folder not found" })

    const movies = await db.collection("movies").find({ folderId: folder._id.toString() }).toArray()

    res.status(200).json({ folder, movies })
  } catch (err) {
    console.error("❌ failed to get movies from 🗂️", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.post("/:id", async (req, res) => {
  const { id } = req.params
  const { title, year, imdbID } = req.body

  if (!title && !imdbID) return res.status(400).json({ error: "😢 title or id is required" })

  try {
    const db = await connectToDB()
    const folder = await db.collection("folders").findOne({ url: id })

    if (!folder) return res.status(404).json({ error: "😢 folder not found" })

    let newMovie = {}

    if (imdbID) {
      const omdbResponse = await ax.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_API_KEY}`)
      const omdbData = omdbResponse.data

      if (omdbData.Response === "False") return res.status(404).json({ error: "😢 movie not found in api" })

      newMovie = {
        title: omdbData.Title,
        year: parseInt(omdbData.Year, 10) || null,
        poster: omdbData.Poster !== "N/A" ? [omdbData.Poster] : [],
        folderId: folder._id.toString(),
        folderUrl: folder.url
      }
    } else {
      newMovie = {
        title,
        year: year || null,
        folderId: folder._id.toString(),
      }
    }

    await db.collection("movies").insertOne(newMovie)

    res.status(201).json({ message: "movie added!", movie: newMovie })
  } catch (err) {
    console.error("❌ failed to add movie", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.delete("/:id/:movieId", async (req, res) => {
  const { id, movieId } = req.params

  try {
    const db = await connectToDB()
    const folder = await db.collection("folders").findOne({ url: id })

    if (!folder) return res.status(404).json({ error: "😢 folder not found" })

    if (!ObjectId.isValid(movieId)) return res.status(400).json({ error: "😢 invalid movie id" })

    const result = await db.collection("movies").deleteOne({ _id: new ObjectId(movieId) })

    if (!result.deletedCount) return res.status(404).json({ error: "😢 movie not found" })

    res.status(200).json({ message: "movie removed!" })
  } catch (err) {
    console.error("❌ failed to delete movie", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.delete("/:id", async (req, res) => {
  const { id } = req.params; 
  try { 
    const db = await connectToDB()
    const folder = await db.collection("folders").findOne({ url: id })
  if(!folder) return res.status(404).json({ error: "😢 folder not found" });
  const moviesInFolder = await db.collection("movies").find({ folderId: folder._id.toString() }).toArray();
    if(moviesInFolder.length > 0) { 
      const unsortedFolder = await db.collection("folders").findOne({ url: "unsorted" }) 
      if(!unsortedFolder) { 
      const newUnsortedFolder = await db.collection("folders").insertOne({
          name: "Unsorted", url: "unsorted", emoji: "📂", isDefault: true })
          const unsortedFolderId = newUnsortedFolder.insertedId
          await db.collection("movies").updateMany(
              { folderId: folder._id.toString() },
              { $set: { folderId: unsortedFolderId.toString(), folderUrl: "unsorted" } } )
      } else { 
          await db.collection("movies").updateMany(
              { folderId: folder._id.toString() }, 
              { $set: { folderId: unsortedFolder._id.toString(), folderUrl: "unsorted" } }
          );
      } 
    } 
    const result = await db.collection("folders").deleteOne({ url: id })
      if(!result.deletedCount) return res.status(500).json({ error: "😢 failed to delete folder" })
      res.status(200).json({ message: "📂 deleted, 🎬 moved to unsorted!" })
  } catch (err) { 
      console.error("❌ failed to delete folder and move movies", err) 
      res.status(500).json({ error: "😢 an error occurred" }) 
  } 
});

r.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "😢 text is required" });
  }

  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`);

    if (response.data.Response === "False") {
      return res.status(404).json({ error: "😢 no movies found" });
    }

    res.status(200).json(response.data.Search);
  } catch (err) {
    console.error("❌ failed to search", err);
    res.status(500).json({ error: "😢 an error occurred" });
  }
});

module.exports = r