import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [severity, setSeverity] = useState("");
  const [search, setSearch] = useState("");

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    let url = "http://127.0.0.1:8000/upload-log/";
    if (severity || search) {
      const params = new URLSearchParams();
      if (severity) params.append("severity", severity);
      if (search) params.append("search", search);
      url += `?${params.toString()}`;
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  return (
    <div>
      <h1>ROS Log Viewer</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Upload</button>

      {/* Severity Filter */}
      <div>
        <label>Filter by Severity: </label>
        <select onChange={(e) => setSeverity(e.target.value)} value={severity}>
          <option value="">All</option>
          <option value="[info]">INFO</option>
          <option value="[fatal]">FATAL</option>
          <option value="[warn]">WARN</option>
          <option value="[error]">ERROR</option>
        </select>
      </div>

      {/* Search Filter */}
      <div>
        <label>Search Logs: </label>
        <input
          type="text"
          placeholder="Enter keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Display Logs */}
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Severity</th>
            <th>Node</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={index}
              className={
                log.severity.toLowerCase() === "[error]"
                  ? "error-log"
                  : log.severity.toLowerCase() === "[warn]"
                  ? "warn-log"
                  : ""
              }
            >
              <td>{log.timestamp}</td>
              <td>{log.severity}</td>
              <td>{log.node}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
