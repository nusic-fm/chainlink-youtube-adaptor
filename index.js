const { Requester } = require('@chainlink/external-adapter')
require('dotenv').config()

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = data => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
// const customParams = {
//   itemId: ['id', 'channelId', 'videoId'],
//   endpoint: false,
// }

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  //  TODO: Check validator
  // const validator = new Validator(callback, input, customParams);
  const validator = { validated: input }
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || 'channels'
  const url = `https://content-youtube.googleapis.com/youtube/v3/${endpoint}`
  const id = validator.validated.data.id
  const part = 'statistics'

  const key = YOUTUBE_API_KEY

  const params = {
    part,
    key
  }
  if (id.includes('user')) {
    // https://www.youtube.com/user/HowieBVEVO
    params.forUsername = id.split('user/')[1]
  } else {
    // https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A
    params.id = id.split('channel/')[1]
  }
  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url,
    params
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data.result = Requester.validateResultNumber(response.data, ['items', '0', 'statistics', 'subscriberCount'])
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
