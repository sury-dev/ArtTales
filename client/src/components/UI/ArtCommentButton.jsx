import React, { useId, useRef, useEffect } from 'react';
import './ArtCommentButton.css';

function ArtCommentButton({ className = "", sizeFunction, ...props }, ref) {
    const id = useId();

    return (
        <textarea
            id={id}
            type='text'
            className={`commentInp ${className}`}
            ref={ref}
            onInput={(e) => {
                    sizeFunction(e.target);
            }} // Trigger resize on change
            rows='1'
            style={{ overflow: 'hidden', resize: 'none' }} // Hide the scrollbar and disable manual resizing
            {...props}
        />
    );
}

export default React.forwardRef(ArtCommentButton);
