const express = require('express')
const logger = require('morgan')
const fs = require('fs')

const tableNames = [
  'films', 'people', 'planets', 'species', 'starships', 'transport', 'vehicles'
]

const app = express()
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.send('root here')
})

// structure of API calls
// "/:category/" -> first up to 10 search results 
// "/:category/?page=:K" -> page K of up to 10 search results 
// "/:category/:N" -> the Nth entry in the category

// we can readFile from the json to access data when GET requests come 
// and calculate how many pages there are when we read the json 
// each table has the name of the json file (without the .json)
// so it's a string (and the path is ./resources/fixtures)

app.get('/:category', (req, res) => {

  // to deal with CORS header 
  res.header('Access-Control-Allow-Origin', '*')

  // first page is just the first 10 page results 
  // and it would be similar code to the Kth page 
  const pageLimit = 10

  const category = tableNames.find((name) => name === req.params.category.toLowerCase())

  // check if the category is legitimate 
  if (category) {

    // use file system to read the corresponding json
    fs.readFile('./resources/fixtures/' + category + '.json', (error, tableJSON) => {
      try {
        if (error) throw error
        const table = JSON.parse(tableJSON)

        // just make a new matrix of 10 entries 
        // we want to grab the "fields" object from each array element 
        let idx = 0
        const filteredTable = table.filter((entry) => {
          idx++
          return idx <= pageLimit
        })
        // we do the second step of only grabbing fields
        fields = filteredTable.map((obj) => {
          return obj.fields
        })

        res.json(fields)
      } catch (er) {
        res.json(er)
      }
    })

  } else {
    res.status(404)
    res.json({ message: "This category doesn't exist." })
  }
}) // end of app.get /:category 



app.get('/:category/page/:id', (req, res) => {

  // to deal with CORS header 
  res.header('Access-Control-Allow-Origin', '*')

  // first page is just the first 10 page results 
  // and it would be similar code to the Kth page 
  const pageLimit = 10

  const category = tableNames.find((name) => name === req.params.category.toLowerCase())

  // check if the category is legitimate 
  if (category) {

    // use file system to read the corresponding json
    fs.readFile('./resources/fixtures/' + category + '.json', (error, tableJSON) => {
      try {
        if (error) throw error

        const table = JSON.parse(tableJSON)
        // check the number of pages in table 
        // for example, 87 entries = 9 pages of up to 10 entries 
        const numPages = Math.ceil(table.length / pageLimit)

        console.log(numPages)
        // check if NUM is possible 
        const num = Number(req.params.id - 1)
        console.log(num)

        if (isNaN(num)) throw "Page number not valid!"
        if (num % 1 !== 0 || num < 0 || num > numPages - 1) throw "Page number not valid!"

        console.log(num > numPages)

        // just make a new array of entries of size pageLimit
        // we want to grab the "fields" object from each array element
        // we have to do some math to get the starting number
        // if we pick page 5 out of 9, page size 10 
        // we start at entry 50 (index 49)
        let idx = 0
        pageStart = pageLimit * num - 1
        pageEnd = pageStart + pageLimit + 1

        const filteredTable = table.filter(() => {
          idx++
          return idx < pageEnd && idx > pageStart
        })
        // we do the second step of only grabbing fields
        fields = filteredTable.map((obj) => {
          return obj.fields
        })
        console.log(fields)
        res.json(fields)

      } catch (er) {
        res.json(er)
      }
    })

  } else {
    res.status(404)
    res.json({ message: "This category doesn't exist." })
  }
}) // end of app.get /:category/page/:id



app.get('/:category/:id', (req, res) => {

  // to deal with CORS header 
  res.header('Access-Control-Allow-Origin', '*')

  // this just returns the object of the particular index 
  // indicated by id in a particular category 

  const category = tableNames.find((name) => name === req.params.category.toLowerCase())

  fs.readFile('./resources/fixtures/' + category + '.json', (error, tableJSON) => {

    const table = JSON.parse(tableJSON)
    const idx = Number(req.params.id)

    try {
      if (isNaN(idx)) throw "Not a valid number in url."
      if (idx % 1 !== 0 || idx < 1 || idx > table.length) throw "ID number out of bounds."

      res.json(table[idx - 1].fields)
    } catch (er) {
      res.status(404)
      res.send(er)
    }
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
