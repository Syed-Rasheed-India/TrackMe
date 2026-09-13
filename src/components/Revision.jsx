import React from "react";
import "./Revision.css";

import { NavLink, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  Circle,
  CircleCheck,
  Plus,
  X
} from "lucide-react";


// ==========================================
// API URL
// ==========================================

const API_URL = "https://trackme-backend-25ut.onrender.com/api/tasks";


// ==========================================
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

  const token =
    localStorage.getItem("token");


  return {

    Authorization:
      `Bearer ${token}`

  };

};


function Revision() {

  const navigate = useNavigate();


  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const [stats, setStats] = useState({

    dueToday: 0,

    overdue: 0,

    scheduled: 0,

    completed: 0

  });


  // ==========================================
  // TASK INPUT
  // ==========================================

  const [task, setTask] = useState([]);

  const [concept, setConcept] = useState("");


  // ==========================================
  // ACTION REQUIRED
  // ==========================================

  const [pendingTasks, setPendingTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login");

      return;

    }


    statsUpdate();

    fetchedPending();

  }, []);


  // ==========================================
  // UPDATE DASHBOARD STATS
  // ==========================================

  const statsUpdate = async () => {

    try {

      const response =
        await fetch(
          API_URL,
          {
            headers:
              getAuthHeaders()
          }
        );


      // ========================================
      // TOKEN EXPIRED / INVALID
      // ========================================

      if (response.status === 401) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch tasks"
        );

      }


      // ========================================
      // TODAY
      // ========================================

      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      let dueToday = 0;

      let overdue = 0;

      let scheduled = 0;

      let completed = 0;


      // ========================================
      // LOOP THROUGH ALL TASKS
      // ========================================

      data.forEach((task) => {

        // Make sure revisions exist

        if (!task.revisions) {

          return;

        }


        // ======================================
        // LOOP THROUGH ALL REVISIONS
        // ======================================

        task.revisions.forEach(
          (revision) => {


            // ----------------------------------
            // COMPLETED
            // ----------------------------------

            if (
              revision.status ===
              "completed"
            ) {

              completed++;

            }


            // ----------------------------------
            // PENDING + UNLOCKED
            // ----------------------------------

            if (
              revision.status ===
                "pending" &&

              revision.unlocked ===
                true
            ) {


              // ------------------------------
              // DUE TODAY
              // ------------------------------

              if (
                revision.date ===
                today
              ) {

                dueToday++;

              }


              // ------------------------------
              // OVERDUE
              // ------------------------------

              else if (
                revision.date <
                today
              ) {

                overdue++;

              }


              // ------------------------------
              // FUTURE
              // ------------------------------

              else if (
                revision.date >
                today
              ) {

                scheduled++;

              }

            }

          }
        );

      });


      // ========================================
      // UPDATE STATE
      // ========================================

      setStats({

        dueToday,

        overdue,

        scheduled,

        completed

      });


    } catch (error) {

      console.error(
        "Error updating stats:",
        error
      );

    }

  };


  // ==========================================
  // FETCH ACTION REQUIRED
  // ==========================================

  const fetchedPending = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(
          API_URL,
          {
            headers:
              getAuthHeaders()
          }
        );


      // ========================================
      // TOKEN EXPIRED / INVALID
      // ========================================

      if (response.status === 401) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch tasks"
        );

      }


      // ========================================
      // TODAY
      // ========================================

      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      const pending = [];


      // ========================================
      // LOOP THROUGH TASKS
      // ========================================

      data.forEach((task) => {

        if (!task.revisions) {

          return;

        }


        // ======================================
        // LOOP THROUGH REVISIONS
        // ======================================

        task.revisions.forEach(
          (revision) => {


            // Show:
            //
            // 1. Due today
            // 2. Overdue
            //
            // Only unlocked + pending

            if (
              revision.status ===
                "pending" &&

              revision.unlocked ===
                true &&

              revision.date <=
                today
            ) {

              pending.push({

                taskId:
                  task._id,

                tasks:
                  task.tasks,

                day:
                  revision.day,

                date:
                  revision.date

              });

            }

          }
        );

      });


      // ========================================
      // SORT BY EARLIEST DATE
      // ========================================

      pending.sort(

        (a, b) =>
          new Date(a.date) -
          new Date(b.date)

      );


      // ========================================
      // ONLY FIRST 3
      // ========================================

      setPendingTasks(
        pending.slice(0, 3)
      );


    } catch (error) {

      console.error(
        "Error fetching pending revisions:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // ADD CONCEPT
  // ==========================================

  const handleAdd = () => {

    const cleanConcept =
      concept.trim();


    if (!cleanConcept) {

      return;

    }


    setTask((prev) => [

      ...prev,

      cleanConcept

    ]);


    setConcept("");

  };


  // ==========================================
  // DELETE CONCEPT
  // ==========================================

  const handleDelete = (
    taskToDelete
  ) => {

    setTask((prev) =>

      prev.filter(
        (item) =>
          item !== taskToDelete
      )

    );

  };


  // ==========================================
  // CONFIRM TASK
  // ==========================================

  const handleConfirm = async () => {

    if (task.length === 0) {

      return;

    }


    // ========================================
    // CREATE NEW TASK
    // ========================================

    const newTask = {

      date:
        new Date()
          .toISOString()
          .split("T")[0],

      tasks:
        task

    };


    try {

      const response =
        await fetch(
          API_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              ...getAuthHeaders()

            },

            body:
              JSON.stringify(
                newTask
              )

          }
        );


      // ========================================
      // TOKEN EXPIRED / INVALID
      // ========================================

      if (response.status === 401) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save task"
        );

      }


      console.log(
        "Saved:",
        data
      );


      // ========================================
      // CLEAR INPUT TASKS
      // ========================================

      setTask([]);


      // ========================================
      // REFRESH ACTION REQUIRED
      // ========================================

      await fetchedPending();


      // ========================================
      // REFRESH DASHBOARD STATS
      // ========================================

      await statsUpdate();


    } catch (error) {

      console.error(
        "CONFIRM ERROR:",
        error
      );

    }

  };


  // ==========================================
  // COMPLETE REVISION
  // ==========================================

  const handleComplete = async (
    taskId,
    day
  ) => {

    try {

      const response =
        await fetch(

          `${API_URL}/${taskId}/revision/${day}`,

          {

            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

              ...getAuthHeaders()

            }

          }

        );


      // ========================================
      // TOKEN EXPIRED / INVALID
      // ========================================

      if (response.status === 401) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to complete revision"
        );

      }


      // ========================================
      // REMOVE COMPLETED REVISION
      // ========================================

      setPendingTasks((prev) =>

        prev.filter(

          (item) =>

            !(
              item.taskId ===
                taskId &&

              item.day ===
                day
            )

        )

      );


      // ========================================
      // UPDATE STATS
      // ========================================

      await statsUpdate();


      // ========================================
      // REFRESH ACTION REQUIRED
      // ========================================

      await fetchedPending();


    } catch (error) {

      console.error(
        "COMPLETE REVISION ERROR:",
        error
      );

    }

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    const [
      year,
      month,
      day
    ] = date.split("-");


    return `${day}/${month}/${year}`;

  };


  // ==========================================
  // DASHBOARD CARDS
  // ==========================================

  const cards = [

    {

      title:
        "DUE TODAY",

      count:
        stats.dueToday,

      type:
        "today",

      icon:
        CalendarDays,

      path:
        "/revision/due-today"

    },

    {

      title:
        "OVERDUE",

      count:
        stats.overdue,

      type:
        "overdue",

      icon:
        AlertTriangle,

      path:
        "/revision/overdue"

    },

    {

      title:
        "SCHEDULED",

      count:
        stats.scheduled,

      type:
        "scheduled",

      icon:
        Calendar,

      path:
        "/revision/scheduled"

    },

    {

      title:
        "COMPLETED",

      count:
        stats.completed,

      type:
        "completed",

      icon:
        CircleCheck,

      path:
        "/revision/completed"

    }

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <>

      {/* ======================================
          NAVBAR
          ====================================== */}

      <div className="navbar">

        <NavLink
          to="/"
          end
        >
          Home
        </NavLink>


        <NavLink
          to="/pomodoro"
        >
          Pomodoro
        </NavLink>


        <NavLink
          to="/revision"
        >
          Revision Tracker
        </NavLink>

      </div>


      {/* ======================================
          REVISION DASHBOARD
          ====================================== */}

      <section
        className="revision-dashboard"
      >

        <div
          className="revision-header"
        >

          <h1>
            Revision Tracker
          </h1>

          <p>
            Stay consistent. Review what you
            learned at the right time.
          </p>

        </div>


        {/* ====================================
            STATS
            ==================================== */}

        <div className="stats-grid">

          {cards.map((card) => {

            const Icon =
              card.icon;


            return (

              <div
                className={`stat-card ${card.type}`}

                key={card.type}

                onClick={() =>
                  navigate(
                    card.path
                  )
                }
              >

                <div className="card-top">

                  <span
                    className="card-title"
                  >

                    {card.title}

                  </span>


                  <Icon
                    size={15}
                  />

                </div>


                <div
                  className="card-count"
                >

                  {card.count}

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* ======================================
          TRACK CONCEPTS
          ====================================== */}

      <div className="track-container">

        <h2>
          Track Concepts
        </h2>


        {/* INPUT + ADD */}

        <div className="add-section">

          <div className="input-wrapper">

            <Plus
              size={18}
            />


            <input

              type="text"

              placeholder="Add a concept to track (e.g., Database Indexing)"

              value={concept}

              onChange={(e) =>
                setConcept(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  handleAdd();

                }

              }}

            />

          </div>


          <button
            className="add-btn"

            onClick={
              handleAdd
            }
          >

            Add

          </button>

        </div>


        {/* ====================================
            TASK CARDS
            ==================================== */}

        {task.length > 0 && (

          <div
            className="task-section"
          >

            <p
              className="section-title"
            >

              TASKS TO ADD

            </p>


            {task.map(
              (item, index) => (

                <div
                  className="task-card"

                  key={`${item}-${index}`}
                >

                  <div
                    className="task-left"
                  >

                    <span
                      className="task-dot"
                    ></span>


                    <span
                      className="task-name"
                    >

                      {item}

                    </span>

                  </div>


                  <button
                    className="delete-btn"

                    onClick={() =>
                      handleDelete(
                        item
                      )
                    }
                  >

                    <X
                      size={16}
                    />

                  </button>

                </div>

              )
            )}


            {/* =================================
                CONFIRM
                ================================= */}

            <div
              className="confirm-wrapper"
            >

              <button
                className="confirm-btn"

                onClick={
                  handleConfirm
                }
              >

                <CircleCheck
                  size={16}
                />

                Confirm

              </button>

            </div>

          </div>

        )}

      </div>


      {/* ======================================
          ACTION REQUIRED
          ====================================== */}

      <section
        className="action-section"
      >

        <h2>
          Action Required
        </h2>


        {/* ====================================
            LOADING
            ==================================== */}

        {loading && (

          <div className="no-due">

            Loading...

          </div>

        )}


        {/* ====================================
            NO DUE
            ==================================== */}

        {!loading &&
          pendingTasks.length === 0 && (

            <div className="no-due">

              No Due

            </div>

          )
        }


        {/* ====================================
            ACTION CARDS
            ==================================== */}

        {!loading &&
          pendingTasks.length > 0 && (

            <div className="action-grid">

              {pendingTasks.map(
                (item, index) => (

                  <div
                    className="action-card"

                    key={
                      `${item.taskId}-${item.day}`
                    }
                  >

                    {/* DATE */}

                    <div
                      className="action-top"
                    >

                      <div
                        className="action-date"
                      >

                        <span>

                          {formatDate(
                            item.date
                          )}

                        </span>


                        <span
                          className="revision-day"
                        >

                          Day {item.day}

                        </span>

                      </div>


                      <CalendarDays
                        size={15}
                      />

                    </div>


                    {/* DIVIDER */}

                    <div
                      className="action-divider"
                    ></div>


                    {/* TASKS */}

                    <div
                      className="action-tasks"
                    >

                      {item.tasks.map(
                        (
                          task,
                          taskIndex
                        ) => (

                          <div
                            className="action-task"

                            key={
                              taskIndex
                            }
                          >

                            <Circle
                              size={11}

                              className="task-circle"
                            />


                            <span>

                              {task}

                            </span>

                          </div>

                        )
                      )}

                    </div>


                    {/* REVIEW BUTTON */}

                    <button

                      className={
                        index === 0

                          ? "review-btn active-review"

                          : "review-btn"
                      }

                      onClick={() =>
                        handleComplete(

                          item.taskId,

                          item.day

                        )
                      }
                    >

                      <CircleCheck
                        size={14}
                      />


                      {index === 0

                        ? "Review Now"

                        : "Start Review"}

                    </button>

                  </div>

                )
              )}

            </div>

          )
        }

      </section>


      {/* ======================================
          SPACED REPETITION
          ====================================== */}

      <section
        className="spaced-section"
      >

        {/* HEADING */}

        <div
          className="spaced-header"
        >

          <h2>
            Why spaced repetition works
          </h2>


          <p>
            Memory retention over time with
            spaced reviews.
          </p>

        </div>


        {/* NOTE */}

        <div
          className="spaced-note"
        >

          <strong>
            Spaced Repetition:
          </strong>{" "}

          Review a concept at increasing
          intervals to strengthen long-term
          memory and reduce forgetting.

        </div>


        {/* CHART */}

        <div
          className="chart-container"
        >

          <svg
            viewBox="0 0 900 330"
            className="spaced-chart"
          >

            {/* Y-AXIS */}

            <text
              x="10"
              y="55"
            >
              100%
            </text>


            <text
              x="10"
              y="160"
            >
              80%
            </text>


            <text
              x="10"
              y="265"
            >
              60%
            </text>


            {/* GRID */}

            <line
              x1="70"
              y1="50"
              x2="850"
              y2="50"
              className="grid-line"
            />


            <line
              x1="70"
              y1="155"
              x2="850"
              y2="155"
              className="grid-line"
            />


            <line
              x1="70"
              y1="260"
              x2="850"
              y2="260"
              className="grid-line"
            />


            {/* REVIEW 1 */}

            <text
              x="105"
              y="25"
              className="review-label"
            >
              Review 1
            </text>


            <line
              x1="110"
              y1="50"
              x2="110"
              y2="155"
              className="review-line"
            />


            <circle
              cx="110"
              cy="50"
              r="6"
              className="review-point"
            />


            {/* REVIEW 2 */}

            <text
              x="280"
              y="25"
              className="review-label"
            >
              Review 2
            </text>


            <line
              x1="285"
              y1="50"
              x2="285"
              y2="125"
              className="review-line"
            />


            <circle
              cx="285"
              cy="50"
              r="6"
              className="review-point"
            />


            {/* REVIEW 3 */}

            <text
              x="455"
              y="25"
              className="review-label"
            >
              Review 3
            </text>


            <line
              x1="460"
              y1="50"
              x2="460"
              y2="100"
              className="review-line"
            />


            <circle
              cx="460"
              cy="50"
              r="6"
              className="review-point"
            />


            {/* REVIEW 4 */}

            <text
              x="635"
              y="25"
              className="review-label"
            >
              Review 4
            </text>


            <line
              x1="640"
              y1="50"
              x2="640"
              y2="80"
              className="review-line"
            />


            <circle
              cx="640"
              cy="50"
              r="6"
              className="review-point"
            />


            {/* MEMORY CURVE */}

            <path
              d="
                M 110 50
                C 160 110, 210 140, 285 155

                M 285 50
                C 330 90, 400 110, 460 125

                M 460 50
                C 520 85, 580 100, 640 105

                M 640 50
                C 700 60, 760 70, 850 80
              "
              className="memory-line"
            />


            {/* BOTTOM LABELS */}

            <text
              x="70"
              y="295"
            >
              Day 0
            </text>


            <text
              x="190"
              y="295"
            >
              Day 1
            </text>


            <text
              x="330"
              y="295"
            >
              Day 3
            </text>


            <text
              x="480"
              y="295"
            >
              Day 7
            </text>


            <text
              x="640"
              y="295"
            >
              Day 14
            </text>


            <text
              x="790"
              y="295"
            >
              Day 30
            </text>

          </svg>

        </div>

      </section>

    </>

  );

}


export default Revision;