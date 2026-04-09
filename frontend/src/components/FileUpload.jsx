import React, { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch('/api/jobseeker/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) alert("File uploaded successfully!");
    else alert("Upload failed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}