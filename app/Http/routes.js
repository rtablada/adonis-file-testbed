'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const File = use('File')

const Route = use('Route')

Route.on('/').render('welcome')

Route.get('/file', function * (request, response) {
  yield File.put('app.json', JSON.stringify({x: 'hey'}, null, 2))
  const x = yield File.connection('protected').get('app.json', null)

  response.send('done')
})
