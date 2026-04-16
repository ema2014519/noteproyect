import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { loggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import nodeRoutes from './presentation/routes/node.routes.js';
import { connectMongo } from './infraestructure/database/mongo/mongo.connection.js';
import { connectMySQL } from './infraestructure/database/mysql/mysql.connection.js';

await connectMongo();
await connectMySQL();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan('dev'));

//imagenes estaticas

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/nodes', nodeRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is working' });
});



//midleware de manejo de errores
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
export default app;
