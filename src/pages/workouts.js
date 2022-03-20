import React, { useState, useEffect } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import styled from "styled-components"

import Layout from "../components/layout"

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const RepRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`

const RepCol = styled.div`
  flex: 1;
`

const RepBtn = styled.div`
  padding: 0px 10px;

  &:hover {
    cursor: pointer;
  }
`

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [isDeletingWorkout, setIsDeletingWorkout] = useState(false)
  const [workoutBeingDeleted, setWorkoutBeingDeleted] = useState({})

  const [isEditing, setIsEditing] = useState(false)
  const [workoutBeingEdited, setWorkoutBeingEdited] = useState({})
  const [targetReps, setTargetReps] = useState(0)
  const [workoutName, setWorkoutName] = useState("")

  useEffect(() => {
    async function init() {
      // get workouts
      let res = await fetch("/.netlify/functions/workouts")
      let json = await res.json()
      json = json.filter(w => !w.isArchived)
      setWorkouts(json)
    }
    init()
  }, [])

  function confirmDelete(workout) {
    setWorkoutBeingDeleted(workout)
    setIsDeletingWorkout(true)
  }

  function onHideModal() {
    setWorkoutBeingDeleted({})
    setIsDeletingWorkout(false)
  }

  function editWorkout(workout) {
    setWorkoutBeingEdited(workout)
    setTargetReps(workout.targetReps)
    setWorkoutName(workout.name)
    setIsEditing(true)
  }

  function onHideEditModal() {
    setWorkoutBeingEdited({})
    setWorkoutName("")
    setTargetReps(0)
    setIsEditing(false)
  }

  async function archiveWorkout() {
    await fetch("/.netlify/functions/workouts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: workoutBeingDeleted.id }),
    })

    setWorkouts(workouts.filter(r => r.id !== workoutBeingDeleted.id))

    onHideModal()
  }

  async function updateWorkout() {
    await fetch("/.netlify/functions/workouts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: workoutBeingEdited.id,
        name: workoutName,
        targetReps,
      }),
    })
    onHideEditModal()
  }

  return (
    <Layout>
      <Section className="container">
        <div className="row">
          {workouts.map((w, idx) => (
            <RepRow key={`${idx}`}>
              <RepCol>{w.name}</RepCol>
              <RepBtn onClick={() => editWorkout(w)}>✏️</RepBtn>
              <RepBtn onClick={() => confirmDelete(w)}>❌</RepBtn>
            </RepRow>
          ))}
        </div>
      </Section>

      <Modal show={isDeletingWorkout} onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Workout?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              <b>Workout</b>: {workoutBeingDeleted.name}
            </li>
          </ul>
          <Button onClick={() => archiveWorkout()}>Confirm</Button>
        </Modal.Body>
      </Modal>

      <Modal show={isEditing} onHide={onHideEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Workout?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={workoutName}
                onChange={e => setWorkoutName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Target Reps</Form.Label>
              <Form.Control
                type="number"
                value={targetReps}
                onChange={e => setTargetReps(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Button className="mt-2" onClick={() => updateWorkout()}>
            Confirm
          </Button>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default Workouts
