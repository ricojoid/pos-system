import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  fullWidth = false,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const stateClass = (isLoading || props.disabled) ? 'btn-disabled' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${stateClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner"></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
