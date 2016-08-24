'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

const thunkify = require('thunkify')
const fs = require('fs')
const path = require('path')

class LocalFilesystem {
  constructor(config) {
    this.config = config
  }

  getFileName(name) {
    return path.normalize(`${this.config.root}/${name}`)
  }

  put(name, contents, options) {
    options = options || this.config.options
    return thunkify(fs.writeFile)(this.getFileName(name), contents, options)
  }

  get(name, options) {
    options = options !== undefined ? options : this.config.options
    return thunkify(fs.readFile)(this.getFileName(name), options)
  }
}

class Filesystem {
  constructor(config, name) {
    this.config = config
    this.name = name

    this.buildConnection()
  }

  buildConnection() {
    if (Filesystem.connections[this.name]) {
      return Filesystem.connections[this.name]
    }

    const connectionConfig = this.config[this.name]

    if (connectionConfig.driver === 'local') {
      const instance = new LocalFilesystem(connectionConfig)

      Filesystem.connections[this.name] = instance

      return instance
    }
  }

  connection(name) {
    return new Filesystem(this.config, name)
  }

  put(name, contents, options) {
    return this.buildConnection().put(name, contents, options)
  }

  get(name, options) {
    return this.buildConnection().get(name, options)
  }
}

Filesystem.connections = [];


class FilesystemProvider extends ServiceProvider {

  * register () {
    // this.app.manager('Adonis/Src/FileSystemManager', Filesystem)
    this.app.bind('AdonisFile/Filesystem', function (app) {
      const config = app.use('Config');

      return new Filesystem(config.get('filesystems'), config.get('filesystems.default'));
    })
  }

}

module.exports = FilesystemProvider
