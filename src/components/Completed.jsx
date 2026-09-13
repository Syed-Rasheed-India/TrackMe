import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Completed.css";


// ==========================================
// API URL
// ==========================================

const API_URL =
  "https://trackme-backend-25ut.onrender.com/api/tasks";


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


function Completed() {

  const navigate = useNavigate();


  // ==========================================
  // COMPLETED TASKS
  // ==========================================

  const [completedTasks, setCompletedTasks] =
    useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // FETCH COMPLETED REVISIONS
  // ==========================================

  const fetchCompleted = async () => {

    try {

      setLoading(true);


      // ========================================
      // GET JWT TOKEN
      // ========================================

      const token =
        localStorage.getItem("token");


      // ========================================
      // CHECK LOGIN
      // ========================================

      if (!token) {

        navigate("/login");

        return;

      }


      // ========================================
      // FETCH TASKS
      // ========================================

      const response =
        await fetch(
          API_URL,
          {
            headers:
              getAuthHeaders()
          }
        );


      // ========================================
      // TOKEN INVALID / EXPIRED
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


      // ========================================
      // RESPONSE DATA
      // ========================================

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch tasks"
        );

      }


      // ========================================
      // COMPLETED ARRAY
      // ========================================

      const completed = [];


      // ========================================
      // LOOP THROUGH TASKS
      // ========================================

      data.forEach((item) => {

        // Make sure revisions exist

        if (!item.revisions) {

          return;

        }


        // ======================================
        // LOOP THROUGH REVISIONS
        // ======================================

        item.revisions.forEach(
          (revision) => {


            // ==================================
            // ONLY COMPLETED REVISIONS
            // ==================================

            if (
              revision.status ===
              "completed"
            ) {

              completed.push({

                taskId:
                  item._id,

                tasks:
                  item.tasks,

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
      // SORT
      // ========================================
      // Latest completed revision first
      // ========================================

      completed.sort(

        (a, b) =>

          new Date(b.date) -
          new Date(a.date)

      );


      // ========================================
      // UPDATE STATE
      // ========================================

      setCompletedTasks(
        completed
      );


    } catch (error) {

      console.error(
        "Error fetching completed revisions:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RUN WHEN PAGE LOADS
  // ==========================================

  useEffect(() => {

    fetchCompleted();

  }, []);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="completed-page">


      {/* ======================================
          MAIN
          ====================================== */}

      <main className="completed-container">


        {/* ====================================
            BACK BUTTON
            ==================================== */}

        <button

          className="completed-back"

          onClick={() =>
            navigate("/revision")
          }

        >

          <ArrowLeft
            size={12}
          />

          <span>

            Revision Tracker

          </span>

        </button>


        {/* ====================================
            HEADER
            ==================================== */}

        <div
          className="completed-header"
        >

          <div>

            <h1>

              Completed Revisions

            </h1>


            <p>

              Revisions you have successfully
              completed.

            </p>

          </div>


          {/* ==================================
              COMPLETED COUNT
              ================================== */}

          <div
            className="completed-count"
          >

            <CheckCircle2
              size={13}
            />

            <span>

              {completedTasks.length}
              {" "}
              Completed

            </span>

          </div>

        </div>


        {/* ====================================
            DIVIDER
            ==================================== */}

        <div
          className="completed-divider"
        />


        {/* ====================================
            LOADING
            ==================================== */}

        {loading && (

          <div
            className="completed-empty"
          >

            Loading completed revisions...

          </div>

        )}


        {/* ====================================
            NO COMPLETED REVISIONS
            ==================================== */}

        {!loading &&
          completedTasks.length === 0 && (

            <div
              className="completed-empty"
            >

              <CheckCircle2
                size={24}
              />

              <p>

                No completed revisions yet.

              </p>

            </div>

          )
        }


        {/* ====================================
            COMPLETED CARDS
            ==================================== */}

        {!loading &&
          completedTasks.length > 0 && (

            <div
              className="completed-list"
            >

              {completedTasks.map(
                (item) => (

                  <div

                    className="completed-card"

                    key={
                      `${item.taskId}-${item.day}`
                    }

                  >


                    {/* ==========================
                        CARD TOP
                        ========================== */}

                    <div
                      className="completed-card-top"
                    >


                      {/* DATE */}

                      <div
                        className="completed-date"
                      >

                        <CalendarDays
                          size={13}
                        />

                        <span>

                          {formatDate(
                            item.date
                          )}

                        </span>

                      </div>


                      {/* BADGE */}

                      <span
                        className="completed-badge"
                      >

                        <CheckCircle2
                          size={9}
                        />

                        DAY {item.day}
                        {" · "}
                        COMPLETED

                      </span>

                    </div>


                    {/* ==========================
                        CONCEPTS
                        ========================== */}

                    <div
                      className="completed-concepts"
                    >

                      {item.tasks.map(
                        (
                          concept,
                          index
                        ) => (

                          <div

                            className="completed-concept"

                            key={index}

                          >

                            <CheckCircle2
                              size={12}
                            />

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

          )
        }

      </main>


      {/* ======================================
          FOOTER
          ====================================== */}

      <footer
        className="completed-footer"
      >

        <div
          className="footer-brand"
        >

          TrackMe.AI

        </div>


        <div
          className="footer-copy"
        >

          © 2024 TrackMe.AI

        </div>


        <div
          className="footer-links"
        >

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


export default Completed;