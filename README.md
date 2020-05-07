# star-wars-api-express
Copied SWAPI JSON files but wrote a server in Express

## Summary

In 2020, the [Star Wars API, or SWAPI](https://swapi.co/) stopped being maintained, while I was working on an API project. 
Later I found out there was a [SWAPI.dev](https://swapi.dev/), but in the meantime I wanted to create a quick Express API that 
serve up the Star Wars data from SWAPI (which are available as JSON files from the [SWAPI Github](https://github.com/phalt/swapi).

All I do is provide service for three different types of GET requests:
/api/:category -> return an array of the first 10 results from a category (such as people, starships, planets)
/api/:category/pages/:pageNumber -> return up to 10 search results from a category if it were divided into pages of 10
/api/:category/:idNumber -> return the idNumber-th item from a category

For full functionality I would recommend a user looking for an API to check out [SWAPI.dev](https://swapi.dev/).

