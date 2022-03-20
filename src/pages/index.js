import React, { useState, useEffect } from "react"
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap"
import styled from "styled-components"

import Layout from "../components/layout"

const MyButton = styled(Button)`
  margin: 10px;
  display: flex;
  flex-direction: column;

  .btn-main {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`

const ProgressBar = styled.div`
  height: 10px;
  width: 100%;
  background-color: #49246e;
  border-radius: 5px;
  position: relative;

  .progress {
    height: 10px;
    background-color: #3bd16f;
    width: ${props =>
      props.reps / props.targetReps > 1
        ? 100
        : (props.reps / props.targetReps) * 100}%;
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const AddRepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RepsValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`

const IncrementerRow = styled.div`
  display: flex;

  button {
    flex: 1;
    margin: 0px 10px;
  }
`

const QuickValuesWrapper = styled.div`
  display: flex;
`

const QuickValueButton = styled(Button)`
  margin: 10px;
  flex: 1;
`

const SaveButton = styled(Button)`
  margin: 0px 10px;
`

const IndexPage = () => {
  const [workouts, setWorkouts] = useState([])
  const [reps, setReps] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState({})
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)
  const [repsBeingAdded, setRepsBeingAdded] = useState(10)
  const [isAddingWorkout, setIsAddingWorkout] = useState(false)
  const [workoutBeingAdded, setWorkoutBeingAdded] = useState("")
  const [workoutBeingEdited, setWorkoutBeingEdited] = useState("")

  useEffect(() => {
    async function init() {
      // get workouts
      let res = await fetch("/.netlify/functions/workouts")
      let json = await res.json()
      json = json.filter(w => !w.isArchived)
      setWorkouts(json)

      let res2 = await fetch("/.netlify/functions/reps")
      let json2 = await res2.json()
      let midnight = new Date().setHours(0, 0, 0, 0)
      json2 = json2.filter(r => r.added > midnight)

      setReps(json2)
    }
    init()
  }, [])

  function openDialog(workout) {
    setSelectedWorkout(workout)
    setIsModalDisplayed(true)
  }

  function onHideModal() {
    setRepsBeingAdded(10)
    setSelectedWorkout({})
    setIsModalDisplayed(false)
  }

  async function save() {
    let count = Number(repsBeingAdded)
    let newreps = {
      workout: selectedWorkout.id,
      count,
    }
    let res = await fetch("/.netlify/functions/reps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newreps),
    })
    let created = await res.json()
    let _reps = reps
    reps.push(created)
    setReps(_reps)
    onHideModal()
  }

  function onHideAddWorkoutModal() {
    setWorkoutBeingAdded("")
    setIsAddingWorkout(false)
  }

  async function saveNewWorkout() {
    let body = {
      name: workoutBeingAdded,
    }

    let res = await fetch("/.netlify/functions/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    let newWorkout = await res.json()

    let _workouts = workouts
    workouts.push(newWorkout)
    setWorkouts(_workouts)

    onHideAddWorkoutModal()
  }

  function getRepsForWorkout(workoutId) {
    let arr = reps.filter(el => el.workout === workoutId)
    if (arr.length > 0) {
      let count = 0
      arr.forEach(r => (count += r.count))
      return count
    }
  }

  return (
    <Layout>
      <Section className="container">
        <div className="row">
          {workouts.map((el, idx) => (
            <MyButton key={idx} onClick={() => openDialog(el)}>
              <div className="btn-main">
                <span>{el.name}</span>
                {getRepsForWorkout(el.id) > 0 && (
                  <span>{getRepsForWorkout(el.id)}</span>
                )}
              </div>
              {el.targetReps && (
                <ProgressBar
                  reps={getRepsForWorkout(el.id)}
                  targetReps={el.targetReps}
                >
                  &nbsp;
                  <div className="progress">&nbsp;</div>
                </ProgressBar>
              )}
            </MyButton>
          ))}
          <hr />
          <MyButton onClick={() => setIsAddingWorkout(true)}>
            Add Workout
          </MyButton>
        </div>
      </Section>

      <Modal show={isModalDisplayed} fullscreen onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Reps ({selectedWorkout.name}){" "}
            {selectedWorkout.targetReps && (
              <span>Target: {selectedWorkout.targetReps}</span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRepsWrapper>
            <RepsValue className="col-md-12">{repsBeingAdded}</RepsValue>
            <IncrementerRow>
              <Button
                onClick={() => setRepsBeingAdded(repsBeingAdded - 1)}
                disabled={repsBeingAdded === 0}
              >
                -1
              </Button>
              <Button onClick={() => setRepsBeingAdded(repsBeingAdded + 1)}>
                +1
              </Button>
            </IncrementerRow>
            <IncrementerRow className="mt-3">
              <Button
                onClick={() => setRepsBeingAdded(repsBeingAdded - 5)}
                disabled={repsBeingAdded < 5}
              >
                -5
              </Button>
              <Button onClick={() => setRepsBeingAdded(repsBeingAdded + 5)}>
                +5
              </Button>
            </IncrementerRow>
            <div className="col-md-12 text-center mt-3">
              <b>Quick Values</b>
            </div>
            <QuickValuesWrapper>
              <QuickValueButton onClick={() => setRepsBeingAdded(10)}>
                10
              </QuickValueButton>
              <QuickValueButton onClick={() => setRepsBeingAdded(20)}>
                20
              </QuickValueButton>
            </QuickValuesWrapper>
            <QuickValuesWrapper>
              <QuickValueButton onClick={() => setRepsBeingAdded(30)}>
                30
              </QuickValueButton>
              <QuickValueButton onClick={() => setRepsBeingAdded(40)}>
                40
              </QuickValueButton>
            </QuickValuesWrapper>
            <QuickValuesWrapper>
              <QuickValueButton onClick={() => setRepsBeingAdded(50)}>
                50
              </QuickValueButton>
              <QuickValueButton onClick={() => setRepsBeingAdded(60)}>
                60
              </QuickValueButton>
            </QuickValuesWrapper>
            <QuickValuesWrapper>
              <QuickValueButton onClick={() => setRepsBeingAdded(70)}>
                70
              </QuickValueButton>
              <QuickValueButton onClick={() => setRepsBeingAdded(80)}>
                80
              </QuickValueButton>
            </QuickValuesWrapper>
            <QuickValuesWrapper>
              <QuickValueButton onClick={() => setRepsBeingAdded(90)}>
                90
              </QuickValueButton>
              <QuickValueButton onClick={() => setRepsBeingAdded(100)}>
                100
              </QuickValueButton>
            </QuickValuesWrapper>
            <hr />
            <SaveButton onClick={() => save()}>Save</SaveButton>
          </AddRepsWrapper>
        </Modal.Body>
      </Modal>

      <Modal show={isAddingWorkout} fullscreen onHide={onHideAddWorkoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Text>Name</InputGroup.Text>
            <FormControl
              value={workoutBeingAdded}
              onChange={e => setWorkoutBeingAdded(e.target.value)}
            />
          </InputGroup>
          <Button onClick={() => saveNewWorkout()}>Save New Workout</Button>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default IndexPage
