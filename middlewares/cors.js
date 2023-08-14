import cors from 'cors';

const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:1234/",
    "https://movies.com", // Produccion o desarrollo
  ];

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        callback(null, true);
      }
      if (!origin) {
        callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  });
