import { useEffect, useState } from "react";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Overdue.css";

const API_URL = "http://localhost:3000/api/tasks";

function Overdue() {
  const navigate = useNavigate();

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch overdue tasks
  const fetchOverdueTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const today = new Date().toISOString().split("T")[0];

      const overdue = data
        .filter(
          (item) =>
            item.status === "pending" &&
            item.date < today
        )
        .sort(
          (a, b) =>
            new Date(a.date) - new Date(b.date)
        );

      setOverdueTasks(overdue);
    } catch (error) {
      console.error("FETCH OVERDUE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueTasks();
  }, []);

  // Complete task
  const handleComplete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to complete task"
        );
      }

      // Remove completed task from overdue page
      setOverdueTasks((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("COMPLETE TASK ERROR:", error);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="overdue-page">

      <div className="overdue-container">

        {/* Header */}
        <div className="overdue-header">

          <button
            className="back-button"
            onClick={() => navigate("/revision")}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="header-content">
            <h1>Overdue Tasks</h1>

            <p>
              {overdueTasks.length}{" "}
              {overdueTasks.length === 1
                ? "task"
                : "tasks"}{" "}
              overdue
            </p>
          </div>

        </div>

        <div className="header-line"></div>

        {/* Loading */}
        {loading && (
          <div className="overdue-message">
            Loading overdue tasks...
          </div>
        )}

        {/* Empty */}
        {!loading && overdueTasks.length === 0 && (
          <div className="overdue-empty">

            <CircleCheck size={48} />

            <h2>No overdue tasks 🎉</h2>

            <p>
              You're all caught up. Keep going!
            </p>

          </div>
        )}

        {/* Tasks */}
        {!loading && overdueTasks.length > 0 && (
          <div className="overdue-list">

            {overdueTasks.map((item) => (

              <div
                className="overdue-card"
                key={item._id}
              >

                {/* Card top */}
                <div className="overdue-card-top">

                  <div className="overdue-date">
                    <span>Due Date</span>
                    <strong>
                      {formatDate(item.date)}
                    </strong>
                  </div>

                  <span className="overdue-badge">
                    Overdue
                  </span>

                </div>

                {/* Concepts */}
                <div className="concept-section">

                  <h3>Topics to revise</h3>

                  <div className="concept-list">

                    {item.tasks.map(
                      (concept, index) => (

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

                {/* Complete button */}
                <button
                  className="complete-button"
                  onClick={() =>
                    handleComplete(item._id)
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

export default Overdue;