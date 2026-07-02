import React, { useState, useEffect } from "react";

interface Assignment {
  id: number;
  subject: string;
  course: string;
  dueDate: string;
  fileName: string;
}

const AssignmentManagement = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    }
  }, []);

  const saveAssignments = (data: Assignment[]) => {
    setAssignments(data);
    localStorage.setItem("assignments", JSON.stringify(data));
  };

  const handleUpload = () => {

    if (!subject || !course || !dueDate || !file) {
      alert("Please fill all fields");
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      subject,
      course,
      dueDate,
      fileName: file.name
    };

    const updated = [...assignments, newAssignment];

    saveAssignments(updated);

    alert("Assignment Uploaded Successfully");

    setSubject("");
    setCourse("");
    setDueDate("");
    setFile(null);
  };

  const deleteAssignment = (id: number) => {
    const updated = assignments.filter(a => a.id !== id);
    saveAssignments(updated);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Assignment Management</h2>

      <div style={{ marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <br/><br/>

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <br/><br/>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <br/><br/>

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <br/><br/>

        <button onClick={handleUpload}>
          Upload Assignment
        </button>

      </div>

      <h3>Uploaded Assignments</h3>

      {assignments.length === 0 && <p>No assignments uploaded yet</p>}

      <ul>
        {assignments.map((a) => (
          <li key={a.id} style={{ marginBottom: "10px" }}>
            <b>{a.subject}</b> | {a.course} | Due: {a.dueDate} | File: {a.fileName}

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteAssignment(a.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default AssignmentManagement;