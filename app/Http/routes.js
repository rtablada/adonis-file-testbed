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
  yield File.put('app.json', "File contents here")

  const x = yield File.connection('protected').get('app.json')

  response.json(x)
})

Route.post('/avatar', function * (request, response) {
  // getting file instance
  const avatar = request.file('avatar', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
  })

  yield File.upload(avatar.clientName(), avatar)

  response.send('hey')
})
