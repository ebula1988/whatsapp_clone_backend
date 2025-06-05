import bcrypt from 'bcryptjs';
import { User } from "../models/index.js";
import { jwt } from "../utils/index.js";

async function register(req, res) {
  try {
    const { email, password } = req.body;

    const user = new User({
      email: email.toLowerCase(),
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    // delete userResponse.password;

    res.status(201).send({
      message: "Usuario registrado correctamente",
      user: userResponse,
    });

  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(400).send({
      message: "Error al registrar el usuario",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const userStorage = await User.findOne({ email: emailLower });
    if (!userStorage) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const check = await bcrypt.compare(password, userStorage.password);
    if (!check) {
      return res.status(401).send({ message: "Contraseña incorrecta" });
    }

    // Generar y devolver ambos tokens
    res.status(200).send({
      access: jwt.createAccessToken(userStorage),
      refresh: jwt.createRefreshToken(userStorage),
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).send({
      message: "Error en la petición",
      error: error.message,
    });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send({ message: "Refresh token is required" });
    }

    // Verificar si el refresh token ha expirado
    const hasExpired = jwt.hasExpiredToken(refreshToken);
    if (hasExpired) {
      return res.status(400).send({ message: "El token ha expirado" });
    }

    // Decodificar para obtener el user_id
    const { user_id } = jwt.decoded(refreshToken);
    if (!user_id) {
      return res.status(400).send({ message: "Refresh token inválido" });
    }

    // Buscar el usuario en la base de datos (sin callback)
    const userStorage = await User.findById(user_id);
    if (!userStorage) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Generar un nuevo access token
    const newAccessToken = jwt.createAccessToken(userStorage);
    return res.status(200).send({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Error en refreshAccessToken:", error);
    return res.status(500).send({
      message: "Error del servidor",
      error: error.message,
    });
  }
}

export const AuthController = {
  register,
  login,
  refreshAccessToken,
};




















/*promesas con then y catch
import { User } from "../models/index.js";

function register(req, res) {
  const { email, password } = req.body;

  const user = new User({
    email: email.toLowerCase(),
    password: password,
  });

  user
    .save()
    .then((userStorage) => {
      res.status(201).send({ user: userStorage });
    })
    .catch((error) => {
      res.status(400).send({
        message: "Error registering user",
        error: error.message,
      });
    });
}

export const AuthController = {
  register,
};*/
