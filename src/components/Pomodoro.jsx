import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Pomodoro.css'

function Pomodoro() {

  // =========================
  // DATE
  // =========================

  let date = new Date()


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

  const inputRef = useRef()
  const minRef = useRef()


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

    const name = inputRef.current.value

    const minutes = Number(minRef.current.value)


    // Don't add empty task

    if (!name || !minutes) {
      return
    }


    // Task name

    setTaskName([
      ...taskName,
      name
    ])


    // Allocated time

    setAllocationMin([
      ...allocationMin,
      minutes
    ])


    // Focused time

    setFocused([
      ...focused,
      0
    ])


    // Remaining time

    setRemaining([
      ...remaining,
      minutes
    ])


    // Progress

    setProgress([
      ...progress,
      0
    ])


    // Status

    setPending([
      ...pending,
      "Pending"
    ])


    // Automatically select first task

    if (taskName.length === 0) {
      setSelectedTask(name)
    }


    // Clear inputs

    inputRef.current.value = ""

    minRef.current.value = ""


    // Close card

    setTaskCard(false)
  }


  // =========================
  // START TIMER
  // =========================

  function Start() {

    // Prevent multiple intervals

    if (timer.current !== null) {
      return
    }


    timer.current = setInterval(() => {

      setSec(prevSec => {

        // Example:
        // 24:59
        // 24:58
        // 24:57

        if (prevSec > 0) {
          return prevSec - 1
        }


        // When seconds reach 0

        setMin(prevMin => {

          // Example:
          // 24:00 -> 23:59

          if (prevMin > 0) {
            return prevMin - 1
          }


          // Timer finished

          clearInterval(timer.current)

          timer.current = null


          return 0
        })


        return 59

      })

    }, 1000)
  }


  // =========================
  // STOP / PAUSE TIMER
  // =========================

  function Stop() {

    clearInterval(timer.current)

    timer.current = null
  }


  // =========================
  // SELECT PRESET
  // =========================

  function selectPreset(minutes) {

    // Stop existing timer

    Stop()


    // Store selected preset

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

  function Reset() {

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


        {/* BRAND */}

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


        {/* GREETING */}

        <div className="greeting">

          <h3>
            Good evening, Alex 👋
          </h3>

          <p>
            Plan your work. Focus deeply.
          </p>

        </div>


        {/* RIGHT */}

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


        {/* =========================
            TABLE HEADER
        ========================= */}

        <div className="taskbody">

          <h3>
            TASK
          </h3>

          <h3>
            ALLOCATED TIME
          </h3>

          <h3>
            FOCUSED
          </h3>

          <h3>
            REMAINING
          </h3>

          <h3>
            PROGRESS
          </h3>

          <h3>
            STATUS
          </h3>

          <h3>
            ACTION
          </h3>

        </div>


        {/* =========================
            TASK ROWS
        ========================= */}

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


                {/* ALLOCATED TIME */}

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


            {/* MODAL HEADER */}

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


            {/* =========================
                TASK NAME
            ========================= */}

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


            {/* =========================
                ALLOCATED TIME
            ========================= */}

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


            {/* =========================
                ADD TASK
            ========================= */}

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


        {/* TIMER HEADER */}

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
              LEFT SIDE
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


            {/* SESSION PRESETS */}

            <div className="timer-field">

              <label>
                SESSION PRESETS
              </label>


              <div className="preset-buttons">


                {/* 25 MIN */}

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


                {/* 5 MIN */}

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


                {/* 15 MIN */}

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


            {/* START FOCUS SESSION */}

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


            {/* CIRCLE */}

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


            {/* MESSAGE */}

            <p className="timer-message">

              Ready to focus? 🎯

            </p>


            {/* CONTROLS */}

            <div className="timer-controls">


              {/* RESET */}

              <button
                className="control-btn reset-btn"
                onClick={Reset}
              >
                ↻
              </button>


              {/* PLAY */}

              <button
                className="control-btn play-btn"
                onClick={Start}
              >
                ▶
              </button>


              {/* STOP */}

              <button
                className="control-btn stop-btn"
                onClick={Stop}
              >
                ■
              </button>


            </div>


          </div>


          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="session-overview">


            <h3>
              Session Overview
            </h3>


            {/* FOCUSED TIME */}

            <div className="overview-card">

              <span>
                Focused Time
              </span>

              <strong>
                0m
              </strong>

            </div>


            {/* REMAINING TIME */}

            <div className="overview-card">

              <span>
                Remaining Time
              </span>

              <strong>

                {selectedTask
                  ? formatTime(
                      remaining[
                        taskName.indexOf(selectedTask)
                      ] || 0
                    )
                  : "0 min"
                }

              </strong>

            </div>


            {/* SESSIONS */}

            <div className="overview-card">

              <span>
                Sessions
              </span>

              <strong>
                0/4
              </strong>

            </div>


            <p className="keep-going">
              Keep going! 🚀
            </p>


          </div>


        </div>

      </div>


     


    </div>

  )
}

export default Pomodoro