const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        required_error: 'Title is required'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().int().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(z.enum(['Action', 'Adventure', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Comedy', 'Romance', 'Crime', 'Animation']), {
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be an array of strings'
    }
    )
})

function validateMovie (input) {
    return movieSchema.safeParse(input)//devuelve un objeto result si hay error o hay datos 
}

function validatePartialMovie (input) {
    return movieSchema.partial().safeParse(input)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}