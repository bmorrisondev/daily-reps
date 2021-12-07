import React, { useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Button, Modal } from "react-bootstrap"
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
  flex-direction: column;

  button {
    margin: 10px;
  }
`

const SaveButton = styled(Button)`
  margin: 0px 10px;
`

const data = [
  {
    id: "123",
    name: "Pushups",
    value: 20,
  },
  {
    id: "456",
    name: "Pullups",
    value: 10,
  },
]

const IndexPage = () => {
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState({})
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)
  const [repsBeingAdded, setRepsBeingAdded] = useState(10)

  useEffect(() => {
    async function init() {
      // get workouts
      let res = await fetch("/.netlify/functions/list-workouts")
      let json = await res.json()
      console.log(json)
      setWorkouts(json)
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

  function save() {
    // TODO: save to API
    onHideModal()
  }

  async function listWorkouts() {
    let res = await fetch("/.netlify/functions/list-workouts")
    return await res.json()
  }

  return (
    <Layout>
      <Section className="container">
        <div className="row">
          {/*
            - List out each workout with the reps that have been done that day so far
            - Tapping the button will open a modal to log more reps
            - Saving it will aggregate it with the same thing
          */}
          {data.map((el, idx) => (
            <MyButton key={idx} onClick={() => openDialog(el)}>
              <span>{el.name}</span>
              <span>{el.value}</span>
            </MyButton>
          ))}
        </div>
      </Section>

      <Modal show={isModalDisplayed} fullscreen onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reps ({selectedWorkout.name})</Modal.Title>
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
            <div className="col-md-12 text-center mt-3">
              <b>Quick Values</b>
            </div>
            <QuickValuesWrapper>
              <Button onClick={() => setRepsBeingAdded(10)}>10</Button>
              <Button onClick={() => setRepsBeingAdded(20)}>20</Button>
              <Button onClick={() => setRepsBeingAdded(30)}>30</Button>
              <Button onClick={() => setRepsBeingAdded(40)}>40</Button>
              <Button onClick={() => setRepsBeingAdded(60)}>60</Button>
              <Button onClick={() => setRepsBeingAdded(70)}>70</Button>
              <Button onClick={() => setRepsBeingAdded(80)}>80</Button>
              <Button onClick={() => setRepsBeingAdded(90)}>90</Button>
              <Button onClick={() => setRepsBeingAdded(100)}>100</Button>
            </QuickValuesWrapper>
            <hr />
            <SaveButton onClick={() => save()}>Save</SaveButton>
          </AddRepsWrapper>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default IndexPage
