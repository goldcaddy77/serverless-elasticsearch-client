'use strict'

const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')
const httpAWSESClass = require('http-aws-es')

module.exports = {
  createClient: createClient,
  getOptions: getOptions
}

function getOptions (options) {
  options = options || {}

  // serverless-offline will set IS_OFFLINE based on whether we're offline
  const devMode = Boolean(process.env.IS_OFFLINE)

  const prefix = options.envPrefix || 'AWS'
  const region = options.region || process.env[`${prefix}_REGION`]
  const host = options.host || process.env[`${prefix}_HOST`]

  delete (options.region) // this doesn't belong in ES options

  if (!region) { throw new TypeError('region is required') }
  if (!host) { throw new TypeError('host is required') }

  const credentials = options.credentials || new AWS.EnvironmentCredentials(prefix)

  const config = Object.assign({}, options, {
    host: host,
    amazonES: {
      region,
      credentials
    }
  })

  // don't sign the request in offline mode
  if (!devMode) {
    config.connectionClass = httpAWSESClass
  }

  return config
}

function createClient (options) {
  return new elasticsearch.Client(getOptions(options))
}
