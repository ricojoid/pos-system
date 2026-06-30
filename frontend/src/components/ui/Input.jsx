import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  fullWidth = true,
  icon: Icon,
  ...props
}, ref) => {
  const containerClass = `input-container ${fullWidth ? 'input-full' : ''}`;
  const inputClass = `input-field ${error ? 'input-error' : ''} ${Icon ? 'input-with-icon' : ''} ${className}`;
  
  return (
    <div className={containerClass}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClass}
          {...props}
        />
      </div>
      {error && (
        <p className="input-error-message">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
