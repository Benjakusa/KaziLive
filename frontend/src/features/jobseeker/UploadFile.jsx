import { useState } from "react";
import { uploadFile } from "../../services/api";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setMessage("");
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    try {
      const res = await uploadFile(file);
      setMessage(res.message);
    } catch {
      setMessage("Upload failed");
    }
  }

  return (
    <div>
      <h3>Upload CV</h3>

      <input type="file" onChange={handleFileChange} />

      {file ? <p>Selected: {file.name}</p> : null}

      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>

      {message ? <p>{message}</p> : null}
    </div>
  );
}

export default UploadFile; 