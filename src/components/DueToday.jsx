import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleCheck,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./DueToday.css";

const API_URL = "https://trackme-backend-25ut.onrender.com/api/tasks";


// =====================================
// GET AUTH HEADERS
// =====================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
};


function DueToday() {

  const navigate = useNavigate();

  const [dueTodayTasks, setDueTodayTasks] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================
  // FETCH TODAY'S REVISIONS
  // =====================================

  const fetchDueToday = async () => {

    try {

      setLoading(true);


      // -------------------------------
      // CHECK TOKEN
      // -------------------------------

      const token = localStorage.getItem("token");

      if (!token) {

        navigate("/login");

        return;

      }


      // -------------------------------
      // FETCH TASKS
      // -------------------------------

      const response = await fetch(API_URL, {

        headers: getAuthHeaders()

      });


      // -------------------------------
      // TOKEN EXPIRED / INVALID
      // -------------------------------

      if (response.status === 401) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

        return;

      }


      // -------------------------------
      // OTHER ERROR
      // -------------------------------

      if (!response.ok) {

        throw new Error(
          "Failed to fetch tasks"
        );

      }


      const data = await response.json();


      // =====================================
      // GET TODAY
      // =====================================

      const today = new Date()
        .toISOString()
        .split("T")[0];


      const dueToday = [];


      // =====================================
      // LOOP THROUGH EVERY TASK
      // =====================================

      data.forEach((item) => {

        if (!item.revisions) {
          return;
        }


        // =====================================
        // LOOP THROUGH EVERY REVISION
        // =====================================

        item.revisions.forEach((revision) => {


          // ---------------------------------
          // ONLY UNLOCKED PENDING REVISIONS
          // DUE TODAY
          // ---------------------------------

          if (

            revision.status === "pending" &&

            revision.unlocked === true &&

            revision.date === today

          ) {


            dueToday.push({

              taskId: item._id,

              tasks: item.tasks,

              day: revision.day,

              date: revision.date

            });

          }

        });

      });


      // =====================================
      // SORT BY REVISION DAY
      // =====================================

      dueToday.sort(

        (a, b) => a.day - b.day

      );


      setDueTodayTasks(dueToday);


    } catch (error) {

      console.error(

        "FETCH DUE TODAY ERROR:",

        error

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {

    fetchDueToday();

  }, []);


  // =====================================
  // COMPLETE REVISION
  // =====================================

  const handleComplete = async (
    taskId,
    day
  ) => {

    try {


      // -------------------------------
      // CHECK TOKEN
      // -------------------------------

      const token = localStorage.getItem("token");


      if (!token) {

        navigate("/login");

        return;

      }


      // -------------------------------
      // PATCH REQUEST
      // -------------------------------

      const response = await fetch(

        `${API_URL}/${taskId}/revision/${day}`,

        {

          method: "PATCH",

          headers: {

            "Content-Type": "application/json",

            ...getAuthHeaders()

          }

        }

      );


      // -------------------------------
      // TOKEN EXPIRED / INVALID
      // -------------------------------

      if (response.status === 401) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

        return;

      }


      const data = await response.json();


      // -------------------------------
      // OTHER ERROR
      // -------------------------------

      if (!response.ok) {

        throw new Error(

          data.message ||

          "Failed to complete revision"

        );

      }


      // =====================================
      // REMOVE COMPLETED REVISION
      // FROM TODAY'S LIST
      // =====================================

      setDueTodayTasks(

        (previousTasks) =>

          previousTasks.filter(

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


      alert(

        error.message ||

        "Failed to complete revision"

      );

    }

  };


  // =====================================
  // FORMAT DATE
  // =====================================

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


  // =====================================
  // UI
  // =====================================

  return (

    <div className="due-today-page">


      <div className="due-today-container">


        {/* =====================================
            HEADER
            ===================================== */}

        <div className="due-today-header">


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

              Due Today

            </h1>


            <p>

              {dueTodayTasks.length}{" "}

              {dueTodayTasks.length === 1

                ? "revision"

                : "revisions"}{" "}

              due today

            </p>


          </div>


        </div>



        <div className="header-line"></div>



        {/* =====================================
            LOADING
            ===================================== */}

        {loading && (

          <div className="due-today-message">

            Loading today's revisions...

          </div>

        )}



        {/* =====================================
            EMPTY
            ===================================== */}

        {!loading &&

          dueTodayTasks.length === 0 && (

            <div className="due-today-empty">


              <CircleCheck size={48} />


              <h2>

                No revisions due today 🎉

              </h2>


              <p>

                You're all caught up for today.

                Keep going!

              </p>


            </div>

        )}



        {/* =====================================
            REVISIONS
            ===================================== */}

        {!loading &&

          dueTodayTasks.length > 0 && (

            <div className="due-today-list">


              {dueTodayTasks.map((item) => (


                <div

                  className="due-today-card"

                  key={`${item.taskId}-${item.day}`}

                >


                  {/* =====================================
                      CARD TOP
                      ===================================== */}

                  <div className="due-today-card-top">


                    {/* DATE */}

                    <div className="due-today-date">


                      <span>

                        Revision Date

                      </span>


                      <strong>

                        {formatDate(

                          item.date

                        )}

                      </strong>


                    </div>



                    {/* REVISION DAY */}

                    <span className="revision-badge">

                      Day {item.day}

                    </span>


                  </div>



                  {/* =====================================
                      TOPICS
                      ===================================== */}

                  <div className="concept-section">


                    <h3>

                      Topics to revise

                    </h3>


                    <div className="concept-list">


                      {item.tasks.map(

                        (

                          concept,

                          index

                        ) => (


                          <div

                            className="concept-item"

                            key={index}

                          >


                            <span className="concept-number">

                              {index + 1}

                            </span>


                            <span>

                              {concept}

                            </span>


                          </div>


                        )

                      )}


                    </div>


                  </div>



                  {/* =====================================
                      COMPLETE BUTTON
                      ===================================== */}

                  <button

                    className="complete-button"

                    onClick={() =>

                      handleComplete(

                        item.taskId,

                        item.day

                      )

                    }

                  >


                    <CircleCheck size={18} />


                    Mark as Completed


                  </button>


                </div>


              ))}


            </div>

        )}


      </div>


    </div>

  );

}


export default DueToday;