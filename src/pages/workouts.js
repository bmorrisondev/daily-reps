import { object } from "prop-types"
import React, { useState, useEffect } from "react"
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap"
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

const RepDelBtn = styled.div`
  padding: 0px 10px;

  &:hover {
    cursor: pointer;
  }
`

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [isDeletingWorkout, setIsDeletingWorkout] = useState(false)
  const [workoutBeingDeleted, setWorkoutBeingDeleted] = useState({})

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

  return (
    <Layout>
      <Section className="container">
        <div className="row">
          {workouts.map((w, idx) => (
            <RepRow key={`${idx}`}>
              <RepCol>{w.name}</RepCol>
              <RepDelBtn onClick={() => confirmDelete(w)}>❌</RepDelBtn>
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
    </Layout>
  )
}

export default Workouts
