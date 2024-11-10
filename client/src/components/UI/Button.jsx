import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-black',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button className={`px-6 py-3 ${className} ${bgColor} ${textColor}`} {...props}>
            {children}
        </button>
    )
}

export default Button
