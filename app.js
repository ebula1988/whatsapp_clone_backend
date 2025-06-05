import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from "http";
import morgan from 'morgan';
import {initSocketServer} from "./utils/index.js";
import {authRoutes, userRoutes} from "./routes/index.js";


// mezclamos express con socket
const app = express();
const server = http.createServer(app);
initSocketServer(server);

//configure body - parser para enviar datos en las peticiones http
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure static folder
app.use(express.static("uploads"));

// configure cors
app.use(cors());

// configure morgan Registrar automáticamente en la consola (o en un archivo) todas las peticiones HTTP que recibe tu servidor.
app.use(morgan('dev'));

// configure routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

export {  server };


