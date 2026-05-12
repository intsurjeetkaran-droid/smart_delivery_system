import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// TODO: Implement Input component with label and error handling
const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div>
      {/* Input placeholder */}
      <input {...props} />
    </div>
  )
}

export default Input