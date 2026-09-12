
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Completed.css";

const API_URL = "http://localhost:3000/api/tasks";

function Completed() {

  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch completed tasks
  const fetchCompleted = async () => {

    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      // Only completed tasks
      const completed = data
        .filter((item) => item.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        );

      setCompletedTasks(completed);

    } catch (error) {

      console.error(
        "Error fetching completed tasks:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // Run when page loads
  useEffect(() => {

    fetchCompleted();

  }, []);


  // Format date
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

    <div className="completed-page">

      <main className="completed-container">


        {/* Back button */}

        <button
          className="completed-back"
          onClick={() => navigate("/revision")}
        >

          <ArrowLeft size={12} />

          <span>
            Revision Tracker
          </span>

        </button>


        {/* Header */}

        <div className="completed-header">

          <div>

            <h1>
              Completed Revisions
            </h1>

            <p>
              Revisions you have successfully completed.
            </p>

          </div>


          <div className="completed-count">

            <CheckCircle2 size={13} />

            <span>
              {completedTasks.length} Completed
            </span>

          </div>

        </div>


        {/* Divider */}

        <div className="completed-divider" />


        {/* Loading */}

        {loading && (

          <div className="completed-empty">
            Loading completed revisions...
          </div>

        )}


        {/* No completed tasks */}

        {!loading &&
          completedTasks.length === 0 && (

            <div className="completed-empty">

              <CheckCircle2 size={24} />

              <p>
                No completed revisions yet.
              </p>

            </div>

          )
        }


        {/* Completed cards */}

        {!loading &&
          completedTasks.length > 0 && (

            <div className="completed-list">

              {completedTasks.map((item) => (

                <div
                  className="completed-card"
                  key={item._id}
                >


                  {/* Card top */}

                  <div className="completed-card-top">

                    <div className="completed-date">

                      <CalendarDays size={13} />

                      <span>
                        {formatDate(item.date)}
                      </span>

                    </div>


                    <span className="completed-badge">

                      <CheckCircle2 size={9} />

                      COMPLETED

                    </span>

                  </div>


                  {/* Concepts */}

                  <div className="completed-concepts">

                    {item.tasks.map(
                      (concept, index) => (

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

              ))}

            </div>

          )
        }

      </main>


      {/* Footer */}

      <footer className="completed-footer">

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

export default Completed;