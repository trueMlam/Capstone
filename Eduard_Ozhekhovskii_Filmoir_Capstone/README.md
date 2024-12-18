# 🎞️ Filmoir

**Filmoir** is a movie app that helps users organize their movie collection into folders. Users can create 📂, add 🎬 using the OMDb API, and store the data in a custom MongoDB. It’s a simple and effective way to tag, store, and track 🎬 you want to watch or watched already.

# [🌐 Live Demo on Render](https://filmoir-capstone-client.onrender.com)
OMDb API is doing its thing on the live app, but MongoDB.. well, it's kind of playing hard to get. So, please grade my work on GitHub, not based on the online version 😅

I mean, it's *working*.. partially. For example, [this page (live db server)](https://filmoir-capstone.onrender.com/folders/franchises) shows the DB just fine, but [this one (client)](https://filmoir-capstone-client.onrender.com/folders/franchises) — not so much. When you run it locally in VSC, everything's great! Just ran out of time to fix the live version 😬

## Features
- Use pre-made folders to organize movies
- Create custom 📂
- Add 🎬 via the OMDb API by title (db stores basic details: title, year, poster)
- Pick a 🎲 random 🎬 from a specific folder or all collection
- Persistent data storage in MongoDB

## Tech Stack
- Frontend: React, React Router
- Backend: Node.js, Express
- Database: MongoDB
- API: OMDb API
- Styling: 🎨 Awesome, mind-blowing Custom CSS.. huge, bold, and totally chaotic 🌪️

## Future Features
- User authentication
- Improved search and filters
- User reviews and ratings

## Run the App

Dependencies are pre-configured in all `package.json` files!

You can run Filmoir using `npm-run-all`:

```bash
cd Eduard_Ozhekhovskii_Filmoir_Capstone
npm start
```
Or run the client and server separately:
```bash
cd Eduard_Ozhekhovskii_Filmoir_Capstone/server
npm start
```
```bash
cd Eduard_Ozhekhovskii_Filmoir_Capstone/client
npm start
```