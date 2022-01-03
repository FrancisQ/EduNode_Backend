const { response, request } = require('express')
const express = require('express')
const app = express()

app.use(express.json()) //needed for POST - allows use of request.body (undefined without it)

const generateID = () => {
    return Math.round(Math.random() * 9999)
}

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

//index request - hello world
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    let generalInfo = `<p>Phonebook has info for ${persons.length}</p>`
    generalInfo += `${new Date()}`
    response.send(generalInfo)
})
//GET all
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
//GET individual
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// DELETE individual
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

//POST individual
app.post('/api/persons', (request, response) => {
    const body = request.body // see line 5
    const name = persons.find(person => person.name === body.name)

    //missing values
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'request missing values'
        })
    } else if (name) {
        return response.status(403).json({
            error: 'name must be unique' + name[0]
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }
    //update local list
    persons = persons.concat(person)
    //return person
    response.json(person)
})

// --- --- //
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})