import React from 'react'

function Select({
    options = [],
    label,
    className = '',
    ...props
}, ref) {

    const id = useId()

    return (
        <div className='w-full'>
            {label && <label htmlFor={id}>{label}</label>}
            <select
                id={id}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${className}`}
                ref={ref}
                {...props}>
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)
