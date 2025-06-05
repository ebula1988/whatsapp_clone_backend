    import mongoose from "mongoose";
    import {server} from "./app.js";
    import {PORT, IP_SERVER, DB_USER, DB_PASSWORD, DB_HOST} from "./constants.js"
    import{io} from "./utils/index.js";

   const mongoDbUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`;

const startServer = async () => {
  try {
    await mongoose.connect(mongoDbUrl);
    console.log("✅ Conectado a MongoDB");

    server.listen(PORT, () => {
      console.log("######################API REST######################");
      console.log(`Server running at http://${IP_SERVER}:${PORT}/api`);

      io.sockets.on('connection', (socket) => {
        console.log("nuevo usuario en la app");

        socket.on('disconnect', () => {
          console.log("usuario desconectado");
        });

        socket.on('subscribe', (room) => {
          socket.join(room);
        });

        socket.on('unsubscribe', (room) => {
          socket.leave(room);
        });
      });
    });

  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
};

startServer();

  