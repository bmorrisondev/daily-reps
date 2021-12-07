const FaunaService = require("@brianmmdev/faunaservice")

exports.handler = async (event, context) => {
  let service = new FaunaService(process.env.FAUNA_SECRET)
  let workouts = await service.listRecords("workouts")
  return {
    statusCode: 200,
    body: JSON.stringify(workouts),
  }
}
