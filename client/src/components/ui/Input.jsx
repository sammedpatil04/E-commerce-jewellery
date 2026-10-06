import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className={`ui-input-group ${className}`}>
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <input id={id} className="ui-input" {...props} />
    </div>
  );
};

export default Input;
