import React from 'react';

const Select = ({ label, id, options, className = '', ...props }) => {
  return (
    <div className={`ui-input-group ${className}`}>
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <select id={id} className="ui-select" {...props}>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
