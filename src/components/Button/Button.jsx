import * as React from 'react';

function Button(props) {
  const { variant, size } = props;



  /**
   * Sets the classes for the button based on the properties specified
   * @param {*} props 
   */
  function setClasses(props) {
    const classes = ['rounded-md'];

    // If no size is set, use regular size classes.
    if (!size && variant !== 'reset') classes.push('py-2 px-4'); 
    
    // Primary button styles
    if (!variant || variant === 'primary') {
      classes.push('bg-green-700 hover:bg-green-900 border border-green-700 text-white font-semibold');
    }

    if (variant === 'outline') {
      classes.push('bg-transparent text-green-700 border border-green-700')
    }

    return classes.join(' ');
  }

  return(
    <button 
      className={`btn ${setClasses(props)} ${props.className}`} 
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;