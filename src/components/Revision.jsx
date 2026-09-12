import React from 'react'
import './Revision.css'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from "react";
import {
  FileText,
  AlertTriangle,
  CalendarDays,
  CircleCheck,Plus, X,
  Circle,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";


function Revision() {
  
    const navigate = useNavigate();
    const [stats, setStats] = useState({
    dueToday: 0,
    overdue: 0,
    scheduled: 0,
    completed: 0
  });

  const statsUpdate = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/tasks");
    const data = await response.json();

    const today = new Date().toISOString().split("T")[0];

    let dueToday = 0;
    let overdue = 0;
    let scheduled = data.length;
    let completed = 0;

    data.forEach((task) => {

      // Completed tasks
      if (task.status === "completed") {
        completed++;
      }

      // Pending tasks
      if (task.status === "pending") {

        if (task.date === today) {
          dueToday++;
        }

        else if (task.date < today) {
          overdue++;
        }

        else if (task.date > today) {
          scheduled++;
        }
      }
    });

    setStats({
      dueToday,
      overdue,
      scheduled,
      completed
    });

  } catch (error) {
    console.error("Error:", error);
  }
};

useEffect(() => {
  statsUpdate();
}, []);

 const cards = [
  {
    title: "DUE TODAY",
    count: stats.dueToday,
    type: "today",
    icon: CalendarDays,
    path: "/revision/due-today"
  },
  {
    title: "OVERDUE",
    count: stats.overdue,
    type: "overdue",
    icon: AlertTriangle,
    path: "/revision/overdue"
  },
  {
    title: "SCHEDULED",
    count: stats.scheduled,
    type: "scheduled",
    icon: Calendar,
    path: "/revision/scheduled"
  },
  {
    title: "COMPLETED",
    count: stats.completed,
    type: "completed",
    icon: CircleCheck,
    path: "/revision/completed"
  }
];

  // Tasks added by user
  const [task, setTask] = useState([]);

  // Input value
  const [concept, setConcept] = useState("");


  // ADD BUTTON
  const handleAdd = async() => {

    if (!concept.trim()) return;

    setTask((prev) => [
      ...prev,
      concept.trim()
    ]);

    await statsUpdate();

    // Clear input after adding
    setConcept("");
  };


  // DELETE BUTTON
  const handleDelete = async (taskToDelete) => {

    setTask((prev) =>
      prev.filter((item) => item !== taskToDelete)
    );
    await statsUpdate()
  };


  // CONFIRM BUTTON
  const handleConfirm = async() => {

    if (task.length === 0) return;

    const newTask = {
      date: new Date().toISOString().split("T")[0],
      tasks: task
    };
    
    try{
      let response = await fetch("http://localhost:3000/api/tasks",{
        method:'POST',
        headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
      })
      const data = await response.json();
 
      if(!response.ok){
        throw new Error(data.message || "Failed to save task");
      }
      console.log("Saved:", data);
      setTask([]);
      await fetchedPending();
      await statsUpdate();
    }catch(err){
      console.log(err)
    }
    console.log(newTask);

    // Clear all cards after confirm
    
  }

  //SAMPLE DATA FOR ACTION REQUIRED
  const tasks_list_action = [
  {
    date: "2026-09-12",
    tasks: ["React", "JavaScript"],
    status:"pending"
  },
  {
    date: "2026-09-13",
    tasks: ["Python", "SQL"],
    status:"pending"
  },
  {
    date: "2026-09-14",
    tasks: ["Node.js", "Express"],
    status:"pending"
  },
  {
    date: "2026-09-15",
    tasks: ["MongoDB", "REST API"],
    status:"pending"
  }
];

 // Store task list in state
  const [tasks, setTasks] = useState(tasks_list_action);


  // Complete a task group
  // const handleComplete = (id) => {

  //   setTasks((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             status: "completed"
  //           }
  //         : item
  //     )
  //   );

  // };


  // Get pending tasks
  // Sort by earliest date
  // Show only first 3

  const [pendingTasks, setPendingTasks] = useState([]);

const handleComplete = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // Remove completed task from UI immediately
    setPendingTasks((prev) =>
      prev.filter((item) => item._id !== id)
    );

    await statsUpdate()

  } catch (error) {
    console.error("Error completing task:", error);
  }
};

const fetchedPending = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/tasks");

    const data = await response.json();

    const pending = data
      .filter((item) => item.status === "pending")
      .sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
      .slice(0, 3);

      // a = first task
        // b = second task
         // Convert their dates into Date objects
  //       // Earlier date - later date = negative → a comes first
  //       // Later date - earlier date = positive → b comes first
  //       // So this sorts from earliest date → latest date
  //       //it run untill the lenght of array

    setPendingTasks(pending);

  } catch (error) {
    console.error("Error:", error);
  }
};

useEffect(() => {
  fetchedPending();
}, []);

  
  // const pendingTasks = tasks
  //   .filter((item) => item.status === "pending")
  //   .sort(
  //     (a, b) =>
  //       new Date(a.date) - new Date(b.date)  //if result is negative a comes first
  //                                            //if result is positive b comes first
  //       // a = first task
  //       // b = second task
  //       // Convert their dates into Date objects
  //       // Earlier date - later date = negative → a comes first
  //       // Later date - earlier date = positive → b comes first
  //       // So this sorts from earliest date → latest date
  //       //it run untill the lenght of array
  //   )
  //   .slice(0, 3);
    // Take only the first 3 tasks after sorting


  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (date) => {

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };


  return (
    <>
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
      <section className="revision-dashboard">

      <div className="revision-header">

        <h1>Revision Tracker</h1>

        <p>
          Stay consistent. Review what you learned at the right time.
        </p>

      </div>


      <div className="stats-grid">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            
              <div
              className={`stat-card ${card.type}`}
              key={card.type}
              onClick={() => navigate(card.path)}
              >

              <div className="card-top">

                <span className="card-title">
                  {card.title}
                </span>

                 <Icon size={15} /> {/*here is the icon */}

              </div>


              <div className="card-count">
                {card.count}
              </div>

            </div>

          );

        })}

      </div>

    </section>

    <div className="track-container">

      <h2>Track Concepts</h2>


      {/* INPUT + ADD BUTTON */}

      <div className="add-section">

        <div className="input-wrapper">

          <Plus size={18} />

          <input
            type="text"
            placeholder="Add a concept to track (e.g., Database Indexing)"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />

        </div>


        <button
          className="add-btn"
          onClick={handleAdd}
        >
          Add
        </button>

      </div>



      {/* TASK CARDS */}

      {task.length > 0 && (

        <div className="task-section">

          <p className="section-title">
            TASKS TO ADD
          </p>


          {task.map((item, index) => (

            <div
              className="task-card"
              key={`${item}-${index}`}
            >

              <div className="task-left">

                <span className="task-dot"></span>

                <span className="task-name">
                  {item}
                </span>

              </div>


              {/* DELETE */}

              <button
                className="delete-btn"
                onClick={() => handleDelete(item)}
              >
                <X size={16} />
              </button>

            </div>

          ))}



          {/* CONFIRM */}

          <div className="confirm-wrapper">

            <button
              className="confirm-btn"
              onClick={handleConfirm}
            >

              <CircleCheck size={16} />

              Confirm

            </button>

          </div>

        </div>

      )}

    </div>

    <section className="action-section">

      <h2>Action Required</h2>


      {/* No pending tasks */}

      {pendingTasks.length === 0 ? (

        <div className="no-due">
          No Due
        </div>

      ) : (

        <div className="action-grid">

          {pendingTasks.map((item, index) => (

            <div
              className="action-card"
              key={item._id}
            >


              {/* DATE */}

              <div className="action-top">

                <div className="action-date">
                  {formatDate(item.date)}
                </div>

                <CalendarDays size={15} />

              </div>


              {/* DIVIDER */}

              <div className="action-divider"></div>


              {/* TASKS */}

              <div className="action-tasks">

                {item.tasks.map((task, taskIndex) => (

                  <div
                    className="action-task"
                    key={taskIndex}
                  >

                    <Circle
                      size={11}
                      className="task-circle"
                    />

                    <span>
                      {task}
                    </span>

                  </div>

                ))}

              </div>


              {/* REVIEW BUTTON */}

              <button
              className={
                index === 0
                  ? "review-btn active-review"
                  : "review-btn"
              }
              onClick={() => handleComplete(item._id)}
            >

                <CircleCheck size={14} />

                {index === 0
                  ? "Review Now"
                  : "Start Review"}

              </button>


            </div>

          ))}

        </div>

      )}

    </section>

    <section className="spaced-section">

      {/* Heading */}
      <div className="spaced-header">
        <h2>Why spaced repetition works</h2>

        <p>
          Memory retention over time with spaced reviews.
        </p>
      </div>


      {/* Short note */}
      <div className="spaced-note">
        <strong>Spaced Repetition:</strong>{" "}
        Review a concept at increasing intervals to strengthen
        long-term memory and reduce forgetting.
      </div>


      {/* Chart */}
      <div className="chart-container">

        <svg
          viewBox="0 0 900 330"
          className="spaced-chart"
        >

          {/* Y-axis labels */}
          <text x="10" y="55">100%</text>
          <text x="10" y="160">80%</text>
          <text x="10" y="265">60%</text>


          {/* Horizontal grid lines */}
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


          {/* Review 1 */}
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


          {/* Review 2 */}
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


          {/* Review 3 */}
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


          {/* Review 4 */}
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


          {/* Forgetting curve */}
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


          {/* Bottom labels */}
          <text x="70" y="295">Day 0</text>
          <text x="190" y="295">Day 1</text>
          <text x="330" y="295">Day 3</text>
          <text x="480" y="295">Day 7</text>
          <text x="640" y="295">Day 14</text>
          <text x="790" y="295">Day 30</text>

        </svg>

      </div>

    </section>

    

    </>
  )
}


export default Revision;