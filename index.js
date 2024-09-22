const express = require("express");
const cors = require("cors");
const {
  registrarUsuarios,
  getProducts,
  getProductsCount,
  login,
  getProductsByCategory,
} = require("./requests");
const verifyToken = require("./middlewares/verifyToken");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server ON en el puerto ${PORT}`));

app.post("/usuarios", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const nuevoUsuario = await registrarUsuarios(nombre, email, password);
    res
      .status(201)
      .json({ message: "Usuario creado con exito", user: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await login(email, password);
    res.status(200).json({ message: "Inicio de sesión exitoso", user, token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(error.code || 500)
      .send(error.message || "Error al iniciar sesión");
  }
});

app.get("/productos", verifyToken, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const totalProductos = await getProductsCount();

    const productos = await getProducts(limit, offset);

    res.status(200).json({
      status: 200,
      data: productos,
      total: totalProductos,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalProductos / limit),
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
    });
  }
});

app.get("/productos/categoria/:categoria", async (req, res) => {
  const { categoria } = req.params;
  try {
    const productos = await getProductsByCategory(categoria);
    res.json(productos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener productos por categoria" });
  }
});


app.get("*", (req, res) => {
  res.send("Ruta de ejemplo");
});

const express = require('express');
const stripe = require('stripe')('tu_clave_privada_de_stripe');
const verifyToken = require('./middlewares/verifyToken'); // Middleware de autenticación

app.use(express.json());

// Rutas ya establecidas (ejemplo)
const { getProducts, login, registerUser } = require('./requests');

app.post('/api/login', login);
app.get('/api/products', verifyToken, getProducts);

// Ruta para crear el Intento de Pago con Stripe
app.post('/api/create-payment-intent', verifyToken, async (req, res) => {
  const { amount } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para gestionar pedidos
app.post('/api/orders', verifyToken, (req, res) => {
  const { cart, userDetails } = req.body;
  // Lógica para guardar el pedido en la base de datos
  res.status(201).send("Pedido creado con éxito");
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
