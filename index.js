const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const figlet = require('figlet')
const asciify = require('asciify-image')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

var user = null;

const credentials = {
	host: 'localhost',
	user: 'root',
	password: '12345',
	database: 'usuarios',
}


app.get('/', (req, res) => {
	res.send('Hola, soy el servidor!')
})

app.post('/api/login', (req, res) => {
	// const { username, password } = req.body
	username = req.body.nombre
	password = req.body.password
	const values = [username, password]
	console.log(values);
	var connection = mysql.createConnection(credentials)
	connection.query("SELECT * FROM users WHERE nombre = ? AND password = ?", values, (err, result) => {
		if (err) {
			console.log(err)
			res.status(500).send(err)
		} else {
			if (result.length > 0) {
				res.status(200).send({
					"id": result[0].id,
					"user": result[0].user,
					"isAuth": true
				})
				user = {
					"id": result[0].id,
					"user": result[0].user,
					"isAuth": true
				}
			} else {
				res.status(400).send('Usuario no existe')
			}
		}
	})
	connection.end()
})

app.get('/api/usuarios', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * FROM users', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
})

app.post('/api/eliminar', (req, res) => {
	const { id } = req.body
	var connection = mysql.createConnection(credentials)
	connection.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario Eliminado" })
		}
	})
	connection.end()
})

app.post('/api/guardar', (req, res) => {
	const { nombre, password } = req.body
	const params = [[ nombre, password]]
	var connection = mysql.createConnection(credentials)
	connection.query('INSERT INTO users (nombre, password) VALUES ?', [params], (err, result) => {
		if (err) {
			res.status(500).send(err)
			console.log(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario creado" })
		}
	})
	connection.end()
})

app.post('/api/editar', (req, res) => {
	const { id, nombre, password } = req.body
	const params = [ nombre, password, id]
	var connection = mysql.createConnection(credentials)
	connection.query('UPDATE users set nombre = ?, password = ? WHERE id = ?', params, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "USuario editado" })
		}
	})
	connection.end()
})

app.listen(4000, async () => {
	console.log(figlet.textSync('SportcITO Server'))
})