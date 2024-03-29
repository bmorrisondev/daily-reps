const FaunaService = require("@brianmmdev/faunaservice")

exports.handler = async (event, context) => {
  let service = new FaunaService(process.env.FAUNA_SECRET)
  const method = event.httpMethod
  const response = {
    statusCode: 401,
  }

  try {
    if (method === "GET") {
      let workouts = await service.listRecords("workouts")
      response.body = JSON.stringify(workouts)
      response.statusCode = 200
    }

    if (method === "POST") {
      let newWorkout = JSON.parse(event.body)
      let created = await service.createRecord("workouts", newWorkout)
      response.statusCode = 200
      response.body = JSON.stringify(created)
    }

    if (method === "PUT") {
      let updates = JSON.parse(event.body)
      console.log(updates)
      let updated = await service.updateRecord("workouts", updates.id, updates)
      response.statusCode = 200
      response.body = JSON.stringify(updated)
    }

    if (method === "DELETE") {
      let workoutBeingDeleted = JSON.parse(event.body)
      let workout = await service.getRecordById(
        "workouts",
        workoutBeingDeleted.id
      )
      workout.isArchived = true
      await service.updateRecord("workouts", workoutBeingDeleted.id, workout)
      response.statusCode = 200
    }
  } catch (err) {
    return {
      statusCode: 200,
      body: err,
    }
  }

  return response
}
