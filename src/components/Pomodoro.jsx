import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Pomodoro.css'

function Pomodoro() {

  // =========================
  // DATE
  // =========================

  const date = new Date()


  // =========================
  // ADD TASK CARD
  // =========================

  const [taskCard, setTaskCard] = useState(false)


  // =========================
  // TASK DATA
  // =========================

  const [taskName, setTaskName] = useState([])
  const [allocationMin, setAllocationMin] = useState([])

  const [focused, setFocused] = useState([])
  const [remaining, setRemaining] = useState([])
  const [progress, setProgress] = useState([])
  const [pending, setPending] = useState([])


  // =========================
  // TIMER
  // =========================

  const [min, setMin] = useState(24)
  const [sec, setSec] = useState(59)

  const [selectedPreset, setSelectedPreset] = useState(25)

  const [selectedTask, setSelectedTask] = useState("")


  // =========================
  // TIMER REFERENCE
  // =========================

  const timer = useRef(null)


  // =========================
  // INPUT REFERENCES
  // =========================

  const inputRef = useRef(null)
  const minRef = useRef(null)


  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (minutes) => {

    minutes = Number(minutes)

    if (minutes < 60) {
      return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)

    const mins = minutes % 60

    if (mins === 0) {
      return `${hours} hr`
    }

    return `${hours} hr ${mins} min`
  }


  // =========================
  // ADD TASK
  // =========================

  const addTask = () => {

    const name = inputRef.current.value.trim()

    const minutes = Number(minRef.current.value)

    if (!name || !minutes || minutes <= 0) {
      return
    }


    // Task name

    setTaskName(prev => [
      ...prev,
      name
    ])


    // Allocated time

    setAllocationMin(prev => [
      ...prev,
      minutes
    ])


    // Focused time

    setFocused(prev => [
      ...prev,
      0
    ])


    // Remaining time

    setRemaining(prev => [
      ...prev,
      minutes
    ])


    // Progress

    setProgress(prev => [
      ...prev,
      0
    ])


    // Status

    setPending(prev => [
      ...prev,
      "Pending"
    ])


    // Automatically select first task

    if (taskName.length === 0) {
      setSelectedTask(name)
    }


    // Clear inputs

    inputRef.current.value = ""
    minRef.current.value = ""


    // Close modal

    setTaskCard(false)
  }


  // =========================
  // UPDATE TASK AFTER SESSION
  // =========================

  const completeFocusSession = () => {

    if (!selectedTask) {
      return
    }


    const taskIndex = taskName.indexOf(selectedTask)

    if (taskIndex === -1) {
      return
    }


    const sessionMinutes = selectedPreset


    // =========================
    // UPDATE FOCUSED
    // =========================

    setFocused(prev => {

      const updated = [...prev]

      const oldFocused = Number(updated[taskIndex]) || 0

      const allocated = Number(allocationMin[taskIndex])

      const newFocused = Math.min(
        oldFocused + sessionMinutes,
        allocated
      )

      updated[taskIndex] = newFocused

      return updated
    })


    // =========================
    // UPDATE REMAINING
    // =========================

    setRemaining(prev => {

      const updated = [...prev]

      const oldRemaining = Number(updated[taskIndex]) || 0

      const newRemaining = Math.max(
        oldRemaining - sessionMinutes,
        0
      )

      updated[taskIndex] = newRemaining

      return updated
    })


    // =========================
    // UPDATE PROGRESS
    // =========================

    setProgress(prev => {

      const updated = [...prev]

      const allocated = Number(allocationMin[taskIndex])

      const oldFocused = Number(focused[taskIndex]) || 0

      const newFocused = Math.min(
        oldFocused + sessionMinutes,
        allocated
      )

      const newProgress = Math.min(
        Math.round((newFocused / allocated) * 100),
        100
      )

      updated[taskIndex] = newProgress

      return updated
    })


    // =========================
    // UPDATE STATUS
    // =========================

    setPending(prev => {

      const updated = [...prev]

      const oldRemaining = Number(remaining[taskIndex]) || 0

      const newRemaining = Math.max(
        oldRemaining - sessionMinutes,
        0
      )

      if (newRemaining === 0) {
        updated[taskIndex] = "Completed"
      } else {
        updated[taskIndex] = "In Progress"
      }

      return updated
    })

  }


  // =========================
  // START TIMER
  // =========================

  const Start = () => {

    // Don't create multiple intervals

    if (timer.current !== null) {
      return
    }


    // Task must be selected

    if (!selectedTask) {
      alert("Please select a task first")
      return
    }


    const taskIndex = taskName.indexOf(selectedTask)

    if (taskIndex === -1) {
      return
    }


    // Don't start completed task

    if (Number(remaining[taskIndex]) <= 0) {
      alert("This task is already completed")
      return
    }


    // Change status

    setPending(prev => {

      const updated = [...prev]

      updated[taskIndex] = "In Progress"

      return updated
    })


    // =========================
    // START INTERVAL
    // =========================

    timer.current = setInterval(() => {

      setSec(prevSec => {

        // Seconds > 0

        if (prevSec > 0) {
          return prevSec - 1
        }


        // Seconds reached 0

        setMin(prevMin => {

          // Example:
          // 24:00 -> 23:59

          if (prevMin > 0) {
            return prevMin - 1
          }


          // =========================
          // TIMER COMPLETED
          // =========================

          clearInterval(timer.current)

          timer.current = null


          // Update selected task

          completeFocusSession()


          // Reset timer for next session

          setMin(selectedPreset - 1)

          setSec(59)


          return 0
        })


        return 59

      })

    }, 1000)
  }


  // =========================
  // STOP / PAUSE TIMER
  // =========================

  const Stop = () => {

    clearInterval(timer.current)

    timer.current = null
  }


  // =========================
  // SELECT PRESET
  // =========================

  const selectPreset = (minutes) => {

    // Stop timer

    Stop()


    // Set selected preset

    setSelectedPreset(minutes)


    // Example:
    // 25 -> 24:59
    // 5  -> 04:59
    // 15 -> 14:59

    setMin(minutes - 1)

    setSec(59)
  }


  // =========================
  // RESET TIMER
  // =========================

  const Reset = () => {

    Stop()

    setMin(selectedPreset - 1)

    setSec(59)
  }


  // =========================
  // CLEAN TIMER
  // =========================

  useEffect(() => {

    return () => {

      clearInterval(timer.current)

    }

  }, [])


  return (

    <div className="container">


      {/* =========================
          NAVBAR
      ========================= */}

      <div className="navbar">

        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/pomodoro">
          Pomodoro
        </NavLink>

        <NavLink to="/revision">
          Revision Tracker
        </NavLink>

      </div>


      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="dashboard-header">

        <div className="brand">

          <div className="brand-logo">

            <img
              src="/LogoV1TrackMe.png"
              alt="TrackMe logo"
            />

          </div>

          <span>
            TrackMe
          </span>

        </div>


        <div className="greeting">

          <h3>
            Good evening, Alex 👋
          </h3>

          <p>
            Plan your work. Focus deeply.
          </p>

        </div>


        <div className="header-right">

          <div className="date">

            Today, {date.getDate()}{" "}

            {date.toLocaleString('en-US', {
              month: 'short'
            })}

          </div>


          <div className="profile">

            <div className="profile-image">
              👨🏻
            </div>

            <span>
              Alex M.
            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          TODAY'S TASKS
      ================================================== */}

      <div className="taskList">


        {/* TASK HEADER */}

        <div className="taskhead">

          <div className="t-tile">

            <h4>
              Today's Task
            </h4>

            <p>
              Manage your workflow and priorities
            </p>

          </div>


          <button
            onClick={() => setTaskCard(true)}
          >
            + Add Task
          </button>

        </div>


        {/* TABLE HEADER */}

        <div className="taskbody">

          <h3>TASK</h3>

          <h3>ALLOCATED TIME</h3>

          <h3>FOCUSED</h3>

          <h3>REMAINING</h3>

          <h3>PROGRESS</h3>

          <h3>STATUS</h3>

          <h3>ACTION</h3>

        </div>


        {/* TASK ROWS */}

        <div className="taskmembers">

          {taskName.map((task, index) => {

            return (

              <div
                className="task-row"
                key={index}
              >

                {/* TASK */}

                <span>
                  {task}
                </span>


                {/* ALLOCATED */}

                <span>
                  {formatTime(allocationMin[index])}
                </span>


                {/* FOCUSED */}

                <span>
                  {formatTime(focused[index])}
                </span>


                {/* REMAINING */}

                <span>
                  {formatTime(remaining[index])}
                </span>


                {/* PROGRESS */}

                <span className="progress-container">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress[index]}%`
                      }}
                    />

                  </div>

                  <span>
                    {progress[index]}%
                  </span>

                </span>


                {/* STATUS */}

                <span>

                  <span
                    className={`status ${
                      pending[index]
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {pending[index]}
                  </span>

                </span>


                {/* ACTION */}

                <span className="actions">
                  ⋮
                </span>

              </div>

            )

          })}

        </div>

      </div>


      {/* ==================================================
          ADD TASK MODAL
      ================================================== */}

      {taskCard && (

        <div className="modal-overlay">

          <div className="add-task-card">

            <div className="add-task-header">

              <div>

                <h2>
                  Add Task
                </h2>

                <p>
                  Create a task for today's focus
                </p>

              </div>


              <button
                className="close-btn"
                onClick={() => setTaskCard(false)}
              >
                ×
              </button>

            </div>


            <div className="form-group">

              <label>
                Task Name
              </label>

              <input
                type="text"
                placeholder="e.g. Study Java"
                ref={inputRef}
              />

            </div>


            <div className="form-group">

              <label>
                Allocated Time
              </label>

              <input
                type="number"
                placeholder="Give in minutes e.g. 120"
                ref={minRef}
              />

            </div>


            <button
              className="create-task-btn"
              onClick={addTask}
            >
              Add Task
            </button>

          </div>

        </div>

      )}


      {/* ==================================================
          FOCUS TIMER
      ================================================== */}

      <div className="focus-timer">


        {/* HEADER */}

        <div className="focus-header">

          <h2>
            Focus Timer
          </h2>

          <p>
            Select a task and start your focus session
          </p>

        </div>


        {/* TIMER CONTENT */}

        <div className="timer-content">


          {/* =========================
              LEFT
          ========================= */}

          <div className="timer-left">


            {/* SELECT TASK */}

            <div className="timer-field">

              <label>
                SELECT TASK
              </label>

              <select
                value={selectedTask}
                onChange={(e) => {
                  setSelectedTask(e.target.value)
                }}
              >

                <option value="">
                  Select a task
                </option>


                {taskName.map((task, index) => (

                  <option
                    key={index}
                    value={task}
                  >
                    {task}
                  </option>

                ))}

              </select>

            </div>


            {/* PRESETS */}

            <div className="timer-field">

              <label>
                SESSION PRESETS
              </label>


              <div className="preset-buttons">

                <button
                  className={
                    selectedPreset === 25
                      ? "selected"
                      : ""
                  }
                  onClick={() => selectPreset(25)}
                >
                  25m Focus
                </button>


                <button
                  className={
                    selectedPreset === 5
                      ? "selected"
                      : ""
                  }
                  onClick={() => selectPreset(5)}
                >
                  5m Short
                </button>


                <button
                  className={
                    selectedPreset === 15
                      ? "selected"
                      : ""
                  }
                  onClick={() => selectPreset(15)}
                >
                  15m Long
                </button>

              </div>

            </div>


            {/* START */}

            <button
              className="start-focus-btn"
              onClick={Start}
            >
              Start Focus Session
            </button>

          </div>


          {/* =========================
              CENTER TIMER
          ========================= */}

          <div className="timer-center">

            <div className="timer-circle">

              <div className="timer-inside">

                <span className="timer-label">
                  FOCUS
                </span>


                <div className="timer-number">

                  <span>
                    {String(min).padStart(2, '0')}
                  </span>

                  <span>
                    :
                  </span>

                  <span>
                    {String(sec).padStart(2, '0')}
                  </span>

                </div>

              </div>

            </div>


            <p className="timer-message">
              Ready to focus? 🎯
            </p>


            <div className="timer-controls">


              {/* RESET */}

              <button
                className="control-btn reset-btn"
                onClick={Reset}
                title="Reset"
              >
                ↻
              </button>


              {/* PLAY */}

              <button
                className="control-btn play-btn"
                onClick={Start}
                title="Start"
              >
                ▶
              </button>


              {/* STOP */}

              <button
                className="control-btn stop-btn"
                onClick={Stop}
                title="Stop"
              >
                ■
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Pomodoro