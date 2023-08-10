const express = require('express');
const crypto = require('node:crypto');
const cors = require('cors');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');



const app = express();
app.use(express.json());//Por defecto le dice que si a todo (*)
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234/',
            'https://movies.com' // Produccion o desarrollo
        ]
        if (ACCEPTED_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        if(!origin) {
            callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.disable('x-powered-by'); // Deshabilitar la cabecera X-Powered-By: Express

// Metodos normales: GET/HEAD/POST
// Metodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS


const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234/',
    'https://movies.com' // Produccion o desarrollo
];

app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    }
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);
    res.status(404).json({
        message: 'Movie not found'
    });
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
    };

    movies.push(newMovie);

    res.status(201).json(newMovie); // 201 CREATED
});

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({
            message: 'Movie not found'
        });
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    };

    movies[movieIndex] = updateMovie;
    res.json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({
            message: 'Movie not found'
        });
    }

    movies.splice(movieIndex, 1);

    return res.json({ message: 'Movie deleted' });
});


const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
