'use strict'

const test = require('ava')

test('region is required', function (t) {
  const error = t.throws(() => {
    getOptionsWithEnv()
  }, TypeError)

  t.is(error.message, 'region is required')
})

test('host is required', function (t) {
  const error = t.throws(() => {
    getOptionsWithEnv({}, {region: 'foo'})
  }, TypeError)

  t.is(error.message, 'host is required')
})


test('region is taken from options if available', function (t) {
  const env = {
    AWS_REGION: 'aws_region',
    AWS_DDB_REGION: 'aws_ddb_region'
  }

  const options = getOptionsWithEnv(env, {region: 'option_region', host: 'foo'})

  t.is(options.amazonES.region, 'option_region')
})

test('region is taken from AWS_REGION by default', function (t) {
  const env = {
    AWS_REGION: 'aws_region'
  }

  const options = getOptionsWithEnv(env, {host: 'foo'})

  t.is(options.amazonES.region, 'aws_region')
})

test('region prefers envPrefix variable', function (t) {
  const env = {
    AWS_REGION: 'aws_region',
    AWS_DDB_REGION: 'aws_ddb_region'
  }

  const options = getOptionsWithEnv(env, {envPrefix: 'AWS_DDB', host: 'foo'})

  t.is(options.amazonES.region, 'aws_ddb_region')
})

test('connectionClass ignored in offline mode', function (t) {
  const env = {
    IS_OFFLINE: true
  }

  const options = getOptionsWithEnv(env, {region: 'foo', host: 'bar'})

  t.falsy(options.connectionClass)
})

test('connectionClass set by default', function (t) {
  const options = getOptionsWithEnv(null, {region: 'foo', host: 'bar'})

  t.is(typeof (options.connectionClass), 'function')
})


test('sets environment credentials by default', function (t) {
  const options = getOptionsWithEnv({}, {region: 'foo', host: 'bar'})

  t.is(options.amazonES.credentials.constructor.name, 'EnvironmentCredentials')
})

function getOptionsWithEnv (env, options) {
  process.env = env || {}
  options = options || {}

  return require('./index').getOptions(options)
}
