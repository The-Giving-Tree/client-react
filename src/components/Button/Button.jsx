import * as React from 'react';

function Button(props) {
  const { variant, size } = props;



  /**
   * Sets the classes for the button based on the properties specified
   * @param {*} props 
   */
  function setClasses(props) {
    const classes = [];

    // If no size is set, use regular size classes.
    if (!size) classes.push('py-2 px-6'); 
    
    if (!variant || variant === 'primary') {
      classes.push('bg-green-700 hover:bg-green-900 text-white font-semibold rounded-md');
    }

    return classes.join(' ');
  }

  return(
    <button 
      className={`btn ${setClasses(props)}`} 
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;