import { useEffect, useState } from "react";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Overdue.css";

const API_URL = "https://trackme-backend-25ut.onrender.com/api/tasks";

function Overdue() {

  const navigate = useNavigate();

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH OVERDUE REVISIONS
  // ==========================================

  const fetchOverdueTasks = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }


      const today =
        new Date().toISOString().split("T")[0];


      const overdue = [];


      // Go through every task
      data.forEach((item) => {

        // Go through every revision
        item.revisions.forEach((revision) => {

          if (
            revision.status === "pending" &&
            revision.unlocked === true &&
            revision.date < today
          ) {

            overdue.push({

              taskId: item._id,

              tasks: item.tasks,

              day: revision.day,

              date: revision.date

            });

          }

        });

      });


      // Oldest overdue first
      overdue.sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );


      setOverdueTasks(overdue);

    } catch (error) {

      console.error(
        "FETCH OVERDUE ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchOverdueTasks();

  }, []);


  // ==========================================
  // COMPLETE REVISION
  // ==========================================

  const handleComplete = async (
    taskId,
    day
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/${taskId}/revision/${day}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to complete revision"
        );

      }


      // Remove completed revision
      setOverdueTasks((prev) =>
        prev.filter(
          (item) =>
            !(
              item.taskId === taskId &&
              item.day === day
            )
        )
      );


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

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  return (

    <div className="overdue-page">

      <div className="overdue-container">


        {/* HEADER */}

        <div className="overdue-header">

          <button
            className="back-button"
            onClick={() =>
              navigate("/revision")
            }
          >

            <ArrowLeft size={18} />

            Back

          </button>


          <div className="header-content">

            <h1>
              Overdue Tasks
            </h1>

            <p>

              {overdueTasks.length}{" "}

              {overdueTasks.length === 1
                ? "revision"
                : "revisions"}{" "}

              overdue

            </p>

          </div>

        </div>


        <div className="header-line"></div>


        {/* LOADING */}

        {loading && (

          <div className="overdue-message">

            Loading overdue revisions...

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          overdueTasks.length === 0 && (

            <div className="overdue-empty">

              <CircleCheck size={48} />

              <h2>
                No overdue tasks 🎉
              </h2>

              <p>
                You're all caught up.
                Keep going!
              </p>

            </div>

          )}


        {/* OVERDUE CARDS */}

        {!loading &&
          overdueTasks.length > 0 && (

            <div className="overdue-list">

              {overdueTasks.map(
                (item, index) => (

                  <div
                    className="overdue-card"
                    key={`${item.taskId}-${item.day}`}
                  >


                    {/* CARD TOP */}

                    <div className="overdue-card-top">

                      <div className="overdue-date">

                        <span>
                          Due Date
                        </span>

                        <strong>
                          {formatDate(
                            item.date
                          )}
                        </strong>

                      </div>


                      <span className="overdue-badge">

                        Day {item.day}

                      </span>

                    </div>


                    {/* CONCEPTS */}

                    <div className="concept-section">

                      <h3>
                        Topics to revise
                      </h3>


                      <div className="concept-list">

                        {item.tasks.map(
                          (
                            concept,
                            conceptIndex
                          ) => (

                            <div
                              className="concept-item"
                              key={conceptIndex}
                            >

                              <span className="concept-number">

                                {conceptIndex + 1}

                              </span>


                              <span>

                                {concept}

                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>


                    {/* COMPLETE */}

                    <button
                      className="complete-button"
                      onClick={() =>
                        handleComplete(
                          item.taskId,
                          item.day
                        )
                      }
                    >

                      <CircleCheck
                        size={18}
                      />

                      Mark as Completed

                    </button>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>

  );

}

export default Overdue;