const express = require('express')
const app = express()
const logger = require('./loggerMiddlewate.js')
const cors = require('cors')
//const http = require('http')



app.use(cors())
app.use(express.json())

app.use(logger)
//import http from 'http'; # NO FUNCIONA NO ES LO MISMO.

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

/* // METODO SIN EXPRESS
const app = http.createServer((request, response) => {
  //response.writeHead(200, { 'Content-Type': 'text/plain' })
  //response.end('Hello World')
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
*/

// METODO CON EXPRESS (LA MEJOR)
app.get('/',(request, response) => {

  response.send('<h1>Hello World!!</h1>')
  //response.json("<h1>Hello World!!</h1>");

})

app.get('/api/notes', (request, response) => {

  //response.writeHead(200, { 'Content-Type': 'application/json' })
  response.json(notes) // NodeJs hace la conversion de forma automatica sin el JSON.stringify.
  //response.end(JSON.stringify(notes));

})

app.get('/api/notes/:id', (request, response) => {

  const id = Number(request.params.id)

  const note = notes.find((note) => note.id == id)

  if(note){
    response.json(note)
  }else{
    response.status(404).send(`<h1>Error ${404} </h1>`)
  }


})

app.delete('/api/notes/:id', (request, response) => {

  const id = Number(request.params.id)

  notes = notes.filter((note) => note.id != id)

  response.send(204).end()

  //response.json(notes);

})

app.post('/api/notes', (request, response) => {

  const note = request.body

  if(!note || !note.content){
    return response.status(400).end()
  }

  const ids = notes.map(note => note.id)

  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
  }

  notes.push(newNote)

  response.status(201).json(newNote)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})
