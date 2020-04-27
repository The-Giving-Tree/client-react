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
    if (!size && variant !== 'reset') {
      classes.push('py-2 px-4');
    } else if (size === 'sm') classes.push('py-1 px-2 text-sm');
    
    // Primary button styles
    if (!variant || variant === 'primary') {
      classes.push('bg-green-700 hover:bg-green-900 border border-green-700 text-white font-semibold');
    }

    if (variant === 'outline') {
      classes.push('bg-transparent text-green-700 border border-green-700')
    }

    if (variant === 'link') {
      classes.push('text-green-700')
    }

    if (props.className) classes.push(props.className);

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