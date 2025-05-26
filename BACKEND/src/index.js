import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios"; 

import { connectDB } from './lib/db.js'; 

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from "./lib/socket.js";

dotenv.config();

// Ya no declaramos 'app' otra vez, usamos la que se exporta de 'socket.js'
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Rutas de autenticación y mensajes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Ruta para obtener juegos
app.get('/api/games', async (req, res) => {
  const page = req.query.page || 0; // Paginación
  const limit = 20; // Número de juegos por página
  
  try {
    // Obtener el token de acceso
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('Access Token:', accessToken); // Verifica que el token se esté obteniendo

    // Hacer la petición a la API de IGDB
    const gamesResponse = await axios.post(
      'https://api.igdb.com/v4/games',
      `fields cover.url, age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,game_status,game_type,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;sort hypes desc; limit ${limit}; offset ${page * limit};`,
      {
        headers: {  
          'Client-ID': process.env.IGDB_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
      }
    );

    console.log('Games Response:', gamesResponse.data); // Verifica que la respuesta de la API de IGDB sea la esperada
    res.json(gamesResponse.data);
  } catch (err) {
    console.error('Error al obtener juegos:', err);
    res.status(500).json({ message: 'Error al obtener juegos' });
  }
});

// Ruta para buscar juegos
app.get('/api/games/search', async (req, res) => {
  const query = req.query.query || ''; // Título del juego a buscar
  
  try {
    // Obtener el token de acceso
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Hacer la petición a la API de IGDB para buscar juegos
    const searchResponse = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields cover.url, age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,game_status,game_type,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites; search "${query}"; limit 10;`,
    {
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
    }
  );

    console.log('Search Response:', searchResponse.data); // Verifica que la respuesta de búsqueda sea correcta
    res.json(searchResponse.data);
  } catch (err) {
    console.error('Error al buscar juegos:', err);
    res.status(500).json({ message: 'Error al buscar juegos' });
  }
});

// Conexión a la base de datos (MongoDB o cualquier otra)
server.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
    connectDB();
});