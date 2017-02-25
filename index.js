'use strict'

const AWS = require('aws-sdk')
const elasticsearch = require('elasticsearch')
const httpAWSESClass = require('http-aws-es')

// serverless-offline will set IS_OFFLINE based on whether we're offline
const devMode = process.env.IS_OFFLINE === 'true'

function createClient (options) {
  const prefix = options.envPrefix || 'AWS'
  const region = options.region || process.env[`${prefix}_REGION`]
  const host = options.host || process.env[`${prefix}_HOST`]

  if (!region) { throw new Error('region is required') }
  if (!host) { throw new Error('host is required') }

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

  return new elasticsearch.Client(config)
}

module.exports = createClient
