import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Pomodoro.css'

function Pomodoro() {

  // =========================
  // DATE
  // =========================

  const date = new Date()

  const [userName, setUserName] = useState("User");
  const [gender, setGender] = useState(null);

  useEffect(() => {
  const getUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        return;
      }

      // Get name from logged-in user
      const name = user.fullName || user.name || user.username;

      if (!name) {
        return;
      }

      // Get first name only
      const firstName = name.trim().split(" ")[0];

      setUserName(firstName);

      // Genderize API
      const response = await fetch(
        `https://api.genderize.io?name=${encodeURIComponent(firstName)}`
      );

      const data = await response.json();

      console.log("Gender API:", data);

      setGender(data.gender);
    } catch (error) {
      console.error("Failed to get user data:", error);
    }
  };

  getUserData();
}, []);


const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
};

const getProfileImage = () => {
  if (gender === "male") {
    return "👨🏻";
  }

  if (gender === "female") {
    return "👩🏻";
  }

  return "👤";
};
  // =========================
  // ADD TASK CARD
  // =========================

  const [taskCard, setTaskCard] = useState(false)


  // =========================
  // TASK DATA
  // =========================

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")

    return savedTasks ? JSON.parse(savedTasks) : []
  })


  // Save tasks whenever tasks changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])


  // =========================
  // TIMER
  // =========================

  const [min, setMin] = useState(24)
  const [sec, setSec] = useState(59)

  const [selectedPreset, setSelectedPreset] = useState(25)

  // Store task ID
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


    // Create new task
    const newTask = {
      id: tasks.length,
      taskName: name,
      allocatedTime: minutes,
      focused: 0,
      remaining: minutes,
      progress: 0,
      status: "Pending"
    }


    // Add new task to existing tasks
    setTasks(prev => [
      ...prev,
      newTask
    ])


    // Clear inputs
    inputRef.current.value = ""
    minRef.current.value = ""

    setTaskCard(false)
  }


  const deleteTask = (taskId) => {
  setTasks(prevTasks =>
    prevTasks.filter(task => task.id !== taskId)
  )

  // If the deleted task was selected in the timer
  if (Number(selectedTask) === taskId) {
    setSelectedTask("")
    Stop()
  }
}

  // =========================
  // UPDATE TASK AFTER SESSION
  // =========================

  const completeFocusSession = () => {

    if (!selectedTask) {
      return
    }


    // Convert select value from string to number
    const taskId = Number(selectedTask)

    const sessionMinutes = selectedPreset


    setTasks(prevTasks => {

      return prevTasks.map(task => {

        // Update only selected task
        if (task.id !== taskId) {
          return task
        }


        // Calculate new focused time
        const newFocused = Math.min(
          Number(task.focused) + sessionMinutes,
          Number(task.allocatedTime)
        )


        // Calculate remaining time
        const newRemaining = Math.max(
          Number(task.allocatedTime) - newFocused,
          0
        )


        // Calculate progress
        const newProgress = Math.min(
          Math.round(
            (newFocused / Number(task.allocatedTime)) * 100
          ),
          100
        )


        // Calculate status
        const newStatus =
          newRemaining === 0
            ? "Completed"
            : "In Progress"


        return {
          ...task,
          focused: newFocused,
          remaining: newRemaining,
          progress: newProgress,
          status: newStatus
        }

      })

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
    
     if (selectedPreset === 25 && !selectedTask) {
    alert("Please select a task first")
    return
  }


    const taskId = Number(selectedTask)


    // Find selected task
    const selectedTaskData = tasks.find(
      task => task.id === taskId
    )


    if (!selectedTaskData) {
      return
    }


    // Don't start completed task
    if (Number(selectedTaskData.remaining) <= 0) {
      alert("This task is already completed")
      return
    }


    // Change task status to In Progress
    setTasks(prevTasks => {

      return prevTasks.map(task => {

        if (task.id === taskId) {

          return {
            ...task,
            status: "In Progress"
          }

        }

        return task

      })

    })


    // =========================
    // START INTERVAL
    // =========================

    timer.current = setInterval(() => {

      setSec(prevSec => {

        // Seconds still remaining
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

    // Stop current timer
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


  // =========================
  // UI
  // =========================

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
      {getGreeting()}, {userName} 👋
    </h3>

    <p>
      Plan your work. Focus deeply.
    </p>

  </div>


  <div className="header-right">

    <div className="date">

      Today, {date.getDate()}{" "}

      {date.toLocaleString("en-US", {
        month: "short"
      })}

    </div>


    <div className="profile">

      <div className="profile-image">
        {getProfileImage()}
      </div>

      <span>
        {userName}
      </span>

    </div>

  </div>

</div>


      {/* =========================
          TODAY'S TASKS
      ========================= */}

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

          {tasks.map((task) => {

            return (

              <div
                className="task-row"
                key={task.id}
              >

                <span>
                  {task.taskName}
                </span>


                <span>
                  {formatTime(task.allocatedTime)}
                </span>


                <span>
                  {formatTime(task.focused)}
                </span>


                <span>
                  {formatTime(task.remaining)}
                </span>


                <span className="progress-container">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${task.progress}%`
                      }}
                    />

                  </div>

                  <span>
                    {task.progress}%
                  </span>

                </span>


                <span>

                  <span
                    className={`status ${
                      task.status
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >

                    {task.status}

                  </span>

                </span>


                <span className="actions">
                  <button
                  className="actions"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  🗑️
                </button>
                </span>

              </div>

            )

          })}

        </div>

      </div>


      {/* =========================
          ADD TASK MODAL
      ========================= */}

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


      {/* =========================
          FOCUS TIMER
      ========================= */}

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


                {tasks.map((task) => (

                  <option
                    key={task.id}
                    value={task.id}
                  >
                    {task.taskName}
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