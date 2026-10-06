import React from 'react';

const Textarea = ({ label, id, className = '', ...props }) => {
  return (
    <div className={`ui-input-group ${className}`}>
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <textarea id={id} className="ui-textarea" {...props} />
    </div>
  );
};

export default Textarea;
