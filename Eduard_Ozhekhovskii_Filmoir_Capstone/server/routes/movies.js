const express = require("express")
const r = express.Router()
const { connectToDB } = require("../db")

r.get("/all", async (req, res) => {
  try {
    const db = await connectToDB()
    const movies = await db.collection("movies").find().toArray()
    res.status(200).json(movies)
  } catch (err) {
    console.error("❌ failed to get all movies", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.get("/all/random", async (req, res) => {
  try {
    const db = await connectToDB()
    const movies = await db.collection("movies").aggregate([{ $sample: { size: 1 } }]).toArray()

    if (movies.length === 0) {
      return res.status(404).json({ error: "😢 no movies found" })
    }

    res.status(200).json(movies[0])
  } catch (err) {
    console.error("❌ failed to get random movie", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

r.get("/folders/:id/random", async (req, res) => {
  const { id } = req.params

  try {
    const db = await connectToDB()
    const folder = await db.collection("folders").findOne({ url: id })

    if (!folder) {
      return res.status(404).json({ error: "😢 folder not found" })
    }

    const movies = await db
      .collection("movies")
      .aggregate([{ $match: { folderId: folder._id.toString() } }, { $sample: { size: 1 } }])
      .toArray()

    if (movies.length === 0) {
      return res.status(404).json({ error: "😢 no movies found in 🗂️" })
    }

    res.status(200).json(movies[0])
  } catch (err) {
    console.error("❌ failed to get random movie from 🗂️", err)
    res.status(500).json({ error: "😢 an error occurred" })
  }
})

const axios = require('axios');
const { Router } = require('express');
const router = Router();

r.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: '😢 text is required' });
  }

  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`);

    if (response.data.Response === 'False') {
      return res.status(404).json({ error: '😢 no movies found' });
    }

    res.status(200).json(response.data.Search);
  } catch (err) {
    console.error('❌ failed to search movies', err);
    res.status(500).json({ error: '😢 an error occurred' });
  }
});

module.exports = router;

module.exports = r