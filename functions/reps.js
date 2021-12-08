const FaunaService = require("@brianmmdev/faunaservice")

exports.handler = async (event, context) => {
  let service = new FaunaService(process.env.FAUNA_SECRET)
  const method = event.httpMethod
  const response = {
    statusCode: 401,
  }

  console.log(event)

  if (method === "GET") {
    let reps = await service.listRecords("reps")
    response.body = JSON.stringify(reps)
    response.statusCode = 200
  }

  if (method === "POST") {
    let reps = JSON.parse(event.body)
    reps.added = Date.now()
    let created = await service.createRecord("reps", reps)
    response.statusCode = 200
    response.body = JSON.stringify(created)
  }

  if (method === "DELETE") {
    let body = JSON.parse(event.body)
    await service.deleteRecord("reps", body.id)
    response.statusCode = 200
  }

  return response
}
