import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Trash2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Scheduled.css";

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


function Scheduled() {

  const navigate = useNavigate();

  const [scheduledTasks, setScheduledTasks] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================
  // FETCH SCHEDULED REVISIONS
  // =====================================

  const fetchScheduledTasks = async () => {

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
      // CHECK OTHER ERRORS
      // -------------------------------

      if (!response.ok) {

        throw new Error(
          "Failed to fetch tasks"
        );

      }


      const data = await response.json();


      // -------------------------------
      // TODAY
      // -------------------------------

      const today = new Date()
        .toISOString()
        .split("T")[0];


      const scheduled = [];


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
          // ONLY UNLOCKED PENDING FUTURE
          // REVISIONS
          // ---------------------------------

          if (

            revision.status === "pending" &&

            revision.unlocked === true &&

            revision.date > today

          ) {


            scheduled.push({

              taskId: item._id,

              tasks: item.tasks,

              day: revision.day,

              date: revision.date

            });

          }

        });

      });


      // =====================================
      // EARLIEST REVISION FIRST
      // =====================================

      scheduled.sort(

        (a, b) =>

          new Date(a.date) -

          new Date(b.date)

      );


      setScheduledTasks(scheduled);


    } catch (error) {

      console.error(

        "Error fetching scheduled revisions:",

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

    fetchScheduledTasks();

  }, []);


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
  // DELETE ORIGINAL TASK
  // =====================================

  const handleDelete = async (taskId) => {


    const confirmDelete = window.confirm(

      "Are you sure you want to delete this task and all its revisions?"

    );


    if (!confirmDelete) {

      return;

    }


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
      // DELETE REQUEST
      // -------------------------------

      const response = await fetch(

        `${API_URL}/${taskId}`,

        {

          method: "DELETE",

          headers: getAuthHeaders()

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

          "Failed to delete task"

        );

      }


      // =====================================
      // REMOVE ALL REVISIONS BELONGING
      // TO THIS TASK FROM UI
      // =====================================

      setScheduledTasks(

        (previousTasks) =>

          previousTasks.filter(

            (item) =>

              item.taskId !== taskId

          )

      );


    } catch (error) {


      console.error(

        "DELETE ERROR:",

        error

      );


      alert(

        error.message ||

        "Failed to delete task"

      );

    }

  };


  // =====================================
  // UI
  // =====================================

  return (

    <div className="scheduled-page">


      <main className="scheduled-container">


        {/* =====================================
            BACK BUTTON
            ===================================== */}

        <button

          className="scheduled-back"

          onClick={() =>

            navigate("/revision")

          }

        >

          <ArrowLeft size={14} />

          <span>

            Revision Tracker

          </span>

        </button>



        {/* =====================================
            HEADER
            ===================================== */}

        <div className="scheduled-header">


          <div>

            <h1>

              Scheduled Revisions

            </h1>


            <p>

              Your upcoming unlocked revisions.

            </p>

          </div>



          <div className="scheduled-count">


            <CalendarDays size={14} />


            <span>

              {scheduledTasks.length} Scheduled

            </span>


          </div>


        </div>



        <div className="scheduled-divider" />



        {/* =====================================
            LOADING
            ===================================== */}

        {loading && (

          <div className="scheduled-empty">

            Loading scheduled revisions...

          </div>

        )}



        {/* =====================================
            EMPTY
            ===================================== */}

        {!loading &&

          scheduledTasks.length === 0 && (

            <div className="scheduled-empty">


              <CalendarDays size={28} />


              <p>

                No scheduled revisions.

              </p>


            </div>

        )}



        {/* =====================================
            REVISION LIST
            ===================================== */}

        {!loading &&

          scheduledTasks.length > 0 && (

            <div className="scheduled-list">


              {scheduledTasks.map(

                (item) => (

                  <div

                    className="scheduled-card"

                    key={`${item.taskId}-${item.day}`}

                  >


                    {/* =====================================
                        CARD TOP
                        ===================================== */}

                    <div className="scheduled-card-top">


                      {/* DATE + REVISION DAY */}

                      <div className="scheduled-date">


                        <CalendarDays

                          size={14}

                        />


                        <span>

                          {formatDate(

                            item.date

                          )}

                        </span>


                        <span className="revision-day">

                          Day {item.day}

                        </span>


                      </div>



                      {/* DELETE */}

                      <div className="scheduled-actions">


                        <button

                          className="scheduled-delete"

                          onClick={() =>

                            handleDelete(

                              item.taskId

                            )

                          }

                        >


                          <Trash2 size={13} />


                          <span>

                            Delete

                          </span>


                        </button>


                      </div>


                    </div>



                    {/* =====================================
                        CONCEPTS
                        ===================================== */}

                    <div className="scheduled-concepts">


                      {item.tasks.map(

                        (

                          concept,

                          index

                        ) => (

                          <div

                            className="scheduled-concept"

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

                )

              )}


            </div>

        )}


      </main>



      {/* =====================================
          FOOTER
          ===================================== */}

      <footer className="scheduled-footer">


        <div className="footer-brand">

          TrackMe.AI

        </div>


        <div className="footer-copy">

          © 2024 TrackMe.AI

        </div>


        <div className="footer-links">


          <span>

            Privacy

          </span>


          <span>

            Terms

          </span>


          <span>

            Help

          </span>


        </div>


      </footer>


    </div>

  );

}


export default Scheduled;