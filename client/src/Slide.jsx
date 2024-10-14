import React, { useState } from "react";

const Slide = ({ slideNumber, removeSlide }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop feedback

  // Handle file upload (drag and drop or file selection)
  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file input when clicking the upload button
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  // Handle drag over event (when an item is dragged over the drop zone)
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); // Set dragging state to true
  };

  // Handle drag leave event (when the dragged item leaves the drop zone)
  const handleDragLeave = () => {
    setIsDragging(false); // Reset dragging state
  };

  // Handle drop event (when an item is dropped in the drop zone)
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false); // Reset dragging state
    const file = e.dataTransfer.files[0]; // Get the dropped file
    handleImageChange(file); // Handle file upload
  };

  return (
    <div className="slide">
      <h3>Slide {slideNumber}</h3>

      {/* Textarea for slide content */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your story slide content here..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      ></textarea>

      {/* Image upload box with drag-and-drop support */}
      <div
        className={`image-upload-box ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          position: "relative",
          cursor: "pointer",
        }}
      >
        {image ? (
          // Display uploaded image
          <img src={image} alt={`Slide ${slideNumber}`} style={{ width: "100%", height: "150px" }} />
        ) : (
          // Placeholder text when no image is uploaded
          <div className="placeholder">
            {isDragging ? "Drop here to upload slide image" : "Drag and drop or click to upload slide image"}
          </div>
        )}

        {/* Hidden input for file selection */}
        <label className="upload-button" style={{ position: "absolute", top: 0, right: 0, padding: "5px" }}>
          <input type="file" onChange={handleFileSelect} style={{ display: "none" }} />
          {image ? "Change Slide Image" : "Upload Image"}
        </label>
      </div>

      {/* Button to remove the slide */}
      <button
        onClick={removeSlide}
        style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
      >
        Remove Slide
      </button>
    </div>
  );
};

export default Slide;
