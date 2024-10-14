// App.jsx
import React from "react";
import StoryForm from "./StoryForm";
import CoverImage from "./Pages/StoryForm/Components/CoverImage";

const App = () => {
  return (
    <div className="app">
      <h1>Create Your Story</h1>
      <StoryForm />
    </div>
  );
};

export default App;
