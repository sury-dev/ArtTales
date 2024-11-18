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
            }}
            rows='1'
            style={{ overflow: 'hidden', resize: 'none' }}
            {...props}
        />
    );
}

export default React.forwardRef(ArtCommentButton);
