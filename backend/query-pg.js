const { Pool } = require("pg")
const pool = new Pool({
    host: "192.168.1.66",
    user: "postgres",
    password: "miclavesecreta",
    database: "likeme",
    allowExitOnIdle: true
})

pool.connect((err, _) => {
    if (err) {
      console.error("Error connecting DB:", err);
    } else {
      console.log("Successful connection DB");
    }
  });


const obtenerPost = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM posts")
        return ({ code: 200, message: rows })
    } catch ({ code, message }) {
        return ({ code, message })
    }
}

const agregarPost = async (value) => {
    try {
        const query = "INSERT INTO posts VALUES (DEFAULT, $1, $2, $3, DEFAULT)"
        const values = [value.titulo, value.url, value.descripcion]
        await pool.query(query, values)
        return ({ code: 201, message: "¡Post agregado!" })
    } catch ({ message }) {
        return ({ code: 500, message: `Se produjo el error: ${message}` })
    }
}

const eliminarPost = async (id) => {
    try {
        const query = "DELETE FROM posts WHERE id = $1"
        const values = [id]
        const { rowCount } = await pool.query(query, values);
        if (rowCount === 0) {
            throw { message: "No existe post con este id" }
        }
        return ({ code: 204, message: "¡Post eliminado!" })
    } catch ({ message }) {
        return ({ code: 500, message: `Se produjo el error: ${message}` })
    }
}

const agregarLikeAPost = async (id) => {
    try {
        const query = "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1"
        const values = [id]
        const { rowCount } = await pool.query(query, values);
        if (rowCount === 0) {
            throw { message: "No existe post con este id" }
        }
        return ({ code: 200, message: "¡Like agregado!" })
    } catch ({ message }) {
        return ({ code: 500, message: `Se produjo el error: ${message}` })
    }
}

module.exports = { agregarPost, obtenerPost, eliminarPost, agregarLikeAPost }