import React from 'react';
import "./Tasks.css";
import "./App.css";

const Tasks = () => {
    return (
        <div className="tasks-content">
            <div className="tasks-inner-content">

                <h1>My Embedded Image</h1>
                <p>This is an example of HTML content with embedded image data.</p>

                <div className="image-container">
                    <img 
                        src="https://firebasestorage.googleapis.com/v0/b/text2image-118de.appspot.com/o/Test%2FFSL.png?alt=media&token=1c0da5c9-e748-4916-96b5-d28ff99e7a6a"
                        alt="Sample Image" 
                    />
                </div>

                <p>More text content goes here.</p>
                </div>
        </div>
    );
};

export default Tasks;
