import { object } from "prop-types"
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

const RepRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`

const RepCol = styled.div`
  flex: 1;
`

const DayHeader = styled.div`
  font-weight: bold;
`

const RepDelBtn = styled.div`
  padding: 0px 10px;

  &:hover {
    cursor: pointer;
  }
`

function Reps() {
  const [reps, setReps] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [isDeletingReps, setIsDeletingReps] = useState(false)
  const [repsBeingDeleted, setRepsBeingDeleted] = useState({})
  const [repsByDays, setRepsByDays] = useState({})

  useEffect(() => {
    async function init() {
      // get workouts
      let res = await fetch("/.netlify/functions/workouts")
      let json = await res.json()
      setWorkouts(json)

      let res2 = await fetch("/.netlify/functions/reps")
      let json2 = await res2.json()
      json2.sort((a, b) => a.added > b.added)
      setReps(json2)

      let struct = {}
      json2.forEach(el => {
        let added = new Date(el.added)
        let theDate = added.toLocaleDateString()
        if (!struct[theDate]) {
          struct[theDate] = []
        }

        struct[theDate].push(el)
      })
      setRepsByDays(struct)
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

  function renderAddedTimeString(epoch) {
    let date = new Date(epoch)
    return date.toLocaleTimeString()
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
          {Object.keys(repsByDays).map(k => (
            <div key={k}>
              <DayHeader>{k}</DayHeader>
              {repsByDays[k].map((el, idx) => (
                <RepRow key={`${k}-${idx}`}>
                  <RepCol>{getWorkoutForRep(el)}</RepCol>
                  <RepCol>{el.added && renderAddedTimeString(el.added)}</RepCol>
                  <RepCol>{el.count}</RepCol>
                  <RepDelBtn onClick={() => confirmDelete(el)}>❌</RepDelBtn>
                </RepRow>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Modal show={isDeletingReps} onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Reps?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              <b>Workout</b>: {getWorkoutForRep(repsBeingDeleted)}
            </li>
            <li>
              <b>Added</b>: {renderAddedString(repsBeingDeleted.added)}
            </li>
            <li>
              <b>Count</b>: {repsBeingDeleted.count}
            </li>
          </ul>
          <Button onClick={() => deleteReps()}>Confirm</Button>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default Reps
