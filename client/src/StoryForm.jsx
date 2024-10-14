// StoryForm.jsx
import React, { useState } from "react";
import CoverImage from "./CoverImage";
import Slide from "./Slide";

const StoryForm = () => {
    const [slides, setSlides] = useState([{ id: 1 }]);
    const [title, setTitle] = useState("");

    const addSlide = () => {
        setSlides([...slides, { id: slides.length + 1 }]);
    };

    const removeSlide = (id) => {
        setSlides(slides.filter((slide) => slide.id !== id));
    };

    const handleSubmit = () => {
        // Handle the story submission logic here
        console.log("Story Submitted");
    };

    return (
        <div className="story-form">
            <CoverImage />
            <input
                type="text"
                placeholder="Enter Story Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {slides.map((slide, index) => (
                <Slide
                    key={slide.id}
                    slideNumber={index + 1}
                    removeSlide={() => removeSlide(slide.id)}
                />
            ))}
            <button onClick={addSlide}>Add Another Slide</button>
            <button onClick={handleSubmit}>Publish Story</button>
        </div>
    );
};

export default StoryForm;
