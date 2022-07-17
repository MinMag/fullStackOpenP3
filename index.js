const express = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))


const morgan = require('morgan')

morgan.token('content', (req, res) => {
  if(req.body.name) {  
    return(JSON.stringify(req.body))
  } else {
    return ''
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
  
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
   response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const createID = () => (Math.floor(Math.random() * 200000))

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'Missing name'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Missing number'
    })
  }
  if(persons.filter(p => p.name === body.name).length !== 0) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: createID()
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT ||  3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})