import React from 'react';
import './Card.css';

const Card = ({
  children,
  className = '',
  glass = false,
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const baseClass = 'card';
  const styleClass = glass ? 'card-glass' : 'card-solid';
  const paddingClass = `card-p-${padding}`;
  const hoverClass = hover || onClick ? 'card-hover' : '';
  
  return (
    <div 
      className={`${baseClass} ${styleClass} ${paddingClass} ${hoverClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
