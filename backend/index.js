const express = require("express");
const cors = require("cors");
const app = express();

// Operaciónes postgres
const { obtenerPost, agregarPost, eliminarPost, agregarLikeAPost } = require("./query-pg.js")

// Middlewares

// Habilitar cors
app.use(cors());
// Procesar json
app.use(express.json())

// Asigna puerto servidor WEB
const PORT = process.env.PORT || 3000

// Obtener todas los registros
app.get("/posts", async (req, res) => {
    const { code, message } = await obtenerPost()
    res.status(code).json(message);
})

// Agregar nuevo registro
app.post("/posts", async (req, res) => {
    const { code, message } = await agregarPost(req.body);
    res.status(code).send(message);
})

// Eliminar un registro
app.delete("/posts/:id", async (req, res) => {
    const { code, message } = await eliminarPost(req.params.id)
    res.status(code).send({ code, message });
})

// Agregar Like a registro
app.put("/posts/like/:id", async (req, res) => {
    const { code, message } = await agregarLikeAPost(req.params.id)
    res.status(code).json({ code, message });
})

app.listen(PORT, console.log(`Server on port: ${PORT}`))