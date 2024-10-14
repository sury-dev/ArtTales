import React, { useState } from "react";

const CoverImage = () => {
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className="cover-image">
            <div
                className={`image-upload-box ${isDragging ? "dragging" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onMouseEnter={() => { }}
            >
                {image ? (
                    <img src={image} alt="Cover" style={{ width: "100%", height: "200px" }} />
                ) : (
                    <div className="placeholder">
                        {isDragging ? "Drop here to upload" : "Drag and drop or click to upload cover image"}
                    </div>
                )}
                <label className="upload-button">
                    <input type="file" onChange={handleImageChange} style={{ display: "none" }} />
                    Change Cover Image
                </label>
            </div>
        </div>
    );
};

export default CoverImage;
