import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Trash2,
  X,
  Plus
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Scheduled.css";


const API_URL = "http://localhost:3000/api/tasks";


function Scheduled() {

  const navigate = useNavigate();


  // ===============================
  // STATE
  // ===============================

  const [scheduledTasks, setScheduledTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // EDIT STATE

  const [editingTask, setEditingTask] =
    useState(null);

  const [editDate, setEditDate] =
    useState("");

  const [editConcepts, setEditConcepts] =
    useState([]);

  const [newConcept, setNewConcept] =
    useState("");


  // ===============================
  // FETCH SCHEDULED TASKS
  // ===============================

  const fetchScheduledTasks = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          "Failed to fetch tasks"
        );

      }


      const data =
        await response.json();


      // Only pending tasks

      const scheduled =
        data
          .filter(
            (item) =>
              item.status === "pending" || item.status==="completed"
          )
          .sort(
            (a, b) =>
              new Date(a.date) -
              new Date(b.date)
          );


      setScheduledTasks(
        scheduled
      );


    } catch (error) {

      console.error(
        "Error fetching scheduled tasks:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ===============================
  // INITIAL FETCH
  // ===============================

  useEffect(() => {

    fetchScheduledTasks();

  }, []);


  // ===============================
  // FORMAT DATE
  // ===============================

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


  // ===============================
  // OPEN EDIT MODAL
  // ===============================

  const handleEdit = (item) => {

    setEditingTask(item);

    setEditDate(item.date);

    setEditConcepts([
      ...item.tasks
    ]);

    setNewConcept("");

  };


  // ===============================
  // CLOSE EDIT MODAL
  // ===============================

  const handleCloseEdit = () => {

    setEditingTask(null);

    setEditDate("");

    setEditConcepts([]);

    setNewConcept("");

  };


  // ===============================
  // CHANGE CONCEPT
  // ===============================

  const handleConceptChange = (
    index,
    value
  ) => {

    const updatedConcepts =
      [...editConcepts];


    updatedConcepts[index] =
      value;


    setEditConcepts(
      updatedConcepts
    );

  };


  // ===============================
  // DELETE CONCEPT
  // ===============================

  const handleDeleteConcept = (
    index
  ) => {

    const updatedConcepts =
      editConcepts.filter(
        (_, conceptIndex) =>
          conceptIndex !== index
      );


    setEditConcepts(
      updatedConcepts
    );

  };


  // ===============================
  // ADD NEW CONCEPT
  // ===============================

  const handleAddConcept = () => {

    const concept =
      newConcept.trim();


    if (!concept) {

      return;

    }


    setEditConcepts([
      ...editConcepts,
      concept
    ]);


    setNewConcept("");

  };


  // ===============================
  // SAVE EDIT
  // ===============================

  const handleSaveEdit = async () => {

    try {

      // Remove empty concepts

      const cleanedConcepts =
        editConcepts
          .map(
            (concept) =>
              concept.trim()
          )
          .filter(
            (concept) =>
              concept.length > 0
          );


      // Check date

      if (!editDate) {

        alert(
          "Please select a date"
        );

        return;

      }


      // Check concepts

      if (
        cleanedConcepts.length === 0
      ) {

        alert(
          "Please add at least one concept"
        );

        return;

      }


      // ===============================
      // PATCH EDIT
      // ===============================

      const response =
        await fetch(
          `${API_URL}/${editingTask._id}/edit`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              date: editDate,

              tasks: cleanedConcepts

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update task"
        );

      }


      console.log(
        "Updated task:",
        data.task
      );


      // Close modal

      handleCloseEdit();


      // Fetch latest MongoDB data

      await fetchScheduledTasks();


    } catch (error) {

      console.error(
        "EDIT ERROR:",
        error
      );


      alert(
        error.message ||
        "Failed to update task"
      );

    }

  };


  // ===============================
  // DELETE TASK
  // ===============================

  const handleDelete = async (
    obj_id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response =
        await fetch(
          `${API_URL}/${obj_id}`,
          {
            method: "DELETE"
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete task"
        );

      }


      // Remove deleted task
      // from React state

      setScheduledTasks(
        (previousTasks) =>
          previousTasks.filter(
            (item) =>
              item._id !== obj_id
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


  // ===============================
  // UI
  // ===============================

  return (

    <div className="scheduled-page">


      <main className="scheduled-container">


        {/* ===============================
            BACK BUTTON
            =============================== */}

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



        {/* ===============================
            HEADER
            =============================== */}

        <div className="scheduled-header">


          <div>

            <h1>
              Scheduled Revisions
            </h1>

            <p>
              All your upcoming revision tasks.
            </p>

          </div>



          <div className="scheduled-count">

            <CalendarDays
              size={14}
            />

            <span>
              {scheduledTasks.length}
              {" "}
              Scheduled
            </span>

          </div>


        </div>



        <div className="scheduled-divider" />



        {/* ===============================
            LOADING
            =============================== */}

        {loading && (

          <div className="scheduled-empty">

            Loading scheduled revisions...

          </div>

        )}



        {/* ===============================
            EMPTY
            =============================== */}

        {!loading &&
          scheduledTasks.length === 0 && (

            <div className="scheduled-empty">

              <CalendarDays
                size={28}
              />

              <p>
                No scheduled revisions.
              </p>

            </div>

        )}



        {/* ===============================
            TASK LIST
            =============================== */}

        {!loading &&
          scheduledTasks.length > 0 && (

            <div className="scheduled-list">


              {scheduledTasks.map(
                (item) => (

                  <div
                    className="scheduled-card"
                    key={item._id}
                  >


                    {/* CARD TOP */}

                    <div className="scheduled-card-top">


                      {/* DATE */}

                      <div className="scheduled-date">

                        <CalendarDays
                          size={14}
                        />

                        <span>
                          {formatDate(
                            item.date
                          )}
                        </span>

                      </div>



                      {/* ACTIONS */}

                      <div className="scheduled-actions">


                        {/* EDIT */}

                        <button
                          className="scheduled-edit"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >

                          <Pencil
                            size={13}
                          />

                          <span>
                            Edit
                          </span>

                        </button>



                        {/* DELETE */}

                        <button
                          className="scheduled-delete"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >

                          <Trash2
                            size={13}
                          />

                          <span>
                            Delete
                          </span>

                        </button>


                      </div>


                    </div>



                    {/* ===============================
                        CONCEPTS
                        =============================== */}

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



      {/* ===============================
          EDIT MODAL
          =============================== */}

      {editingTask && (

        <div className="edit-overlay">


          <div className="edit-modal">


            {/* MODAL HEADER */}

            <div className="edit-modal-header">


              <div>

                <h2>
                  Edit Revision
                </h2>

                <p>
                  Update date and concepts.
                </p>

              </div>


              <button
                className="edit-close"
                onClick={
                  handleCloseEdit
                }
              >

                <X size={18} />

              </button>


            </div>



            {/* ===============================
                DATE
                =============================== */}

            <div className="edit-field">


              <label>
                Revision Date
              </label>


              <input
                type="date"
                value={editDate}
                onChange={(event) =>
                  setEditDate(
                    event.target.value
                  )
                }
              />


            </div>



            {/* ===============================
                CONCEPTS
                =============================== */}

            <div className="edit-field">


              <label>
                Concepts
              </label>



              {/* EXISTING CONCEPTS */}

              <div className="edit-concepts">


                {editConcepts.map(
                  (
                    concept,
                    index
                  ) => (

                    <div
                      className="edit-concept-row"
                      key={index}
                    >


                      <input
                        type="text"
                        value={concept}
                        onChange={(event) =>
                          handleConceptChange(
                            index,
                            event.target.value
                          )
                        }
                      />


                      <button
                        className="edit-remove"
                        onClick={() =>
                          handleDeleteConcept(
                            index
                          )
                        }
                      >

                        <X size={15} />

                      </button>


                    </div>

                  )
                )}


              </div>



              {/* ===============================
                  ADD NEW CONCEPT
                  =============================== */}

              <div className="add-concept-row">


                <input
                  type="text"
                  placeholder="Add new concept"
                  value={newConcept}
                  onChange={(event) =>
                    setNewConcept(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter"
                    ) {

                      handleAddConcept();

                    }

                  }}
                />


                <button
                  className="add-concept"
                  onClick={
                    handleAddConcept
                  }
                >

                  <Plus size={15} />

                  Add

                </button>


              </div>


            </div>



            {/* ===============================
                MODAL BUTTONS
                =============================== */}

            <div className="edit-modal-actions">


              <button
                className="edit-cancel"
                onClick={
                  handleCloseEdit
                }
              >

                Cancel

              </button>



              <button
                className="edit-save"
                onClick={
                  handleSaveEdit
                }
              >

                Save Changes

              </button>


            </div>


          </div>

        </div>

      )}



      {/* ===============================
          FOOTER
          =============================== */}

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