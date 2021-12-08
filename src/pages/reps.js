import React, { useState, useEffect } from "react"
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap"
import styled from "styled-components"

import Layout from "../components/layout"

const MyButton = styled(Button)`
  margin: 10px;
  display: flex;
  justify-content: space-between;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 10px;
`
function Reps() {
  const [reps, setReps] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [isDeletingReps, setIsDeletingReps] = useState(false)
  const [repsBeingDeleted, setRepsBeingDeleted] = useState({})

  useEffect(() => {
    async function init() {
      // get workouts
      let res = await fetch("/.netlify/functions/workouts")
      let json = await res.json()
      setWorkouts(json)

      let res2 = await fetch("/.netlify/functions/reps")
      let json2 = await res2.json()
      json2.sort((a, b) => a.added < b.added)

      setReps(json2)
    }
    init()
  }, [])

  function confirmDelete(rep) {
    setRepsBeingDeleted(rep)
    setIsDeletingReps(true)
  }

  function getWorkoutForRep(rep) {
    const wo = workouts.find(el => el.id === rep.workout)
    if (wo) {
      return wo.name
    }
  }

  function renderAddedString(epoch) {
    let date = new Date(epoch)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  function onHideModal() {
    setRepsBeingDeleted({})
    setIsDeletingReps(false)
  }

  async function deleteReps() {
    await fetch("/.netlify/functions/reps", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: repsBeingDeleted.id }),
    })

    setReps(reps.filter(r => r.id !== repsBeingDeleted.id))

    onHideModal()
  }

  return (
    <Layout>
      <Section className="container">
        <div className="row">
          {reps.map((el, idx) => (
            <MyButton key={idx} onClick={() => confirmDelete(el)}>
              <span>{getWorkoutForRep(el)}</span>
              <span>{el.added && renderAddedString(el.added)}</span>
              <span>{el.count}</span>
            </MyButton>
          ))}
        </div>
      </Section>

      <Modal show={isDeletingReps} onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Reps?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{JSON.stringify(repsBeingDeleted)}</div>
          <Button onClick={() => deleteReps()}>Confirm</Button>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default Reps
