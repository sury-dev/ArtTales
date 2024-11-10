import React, {useId} from 'react'

const Input = React.forwardRef((
    {
        label,
        type = 'text',
        className = '',
        ...props
    }, ref
)=>{
    const id = useId()
    return (
        <div>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                type={type}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${className}`}
                ref={ref}
                {...props} />
        </div>
    )
})

export default Input
