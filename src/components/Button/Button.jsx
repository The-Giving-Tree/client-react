import * as React from 'react';

function Button(props) {
  const { variant, size } = props;

  // Styles classes for all the different sizes of buttons
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-2 px-4 text-lg'
  }

  // Styles/Classes for all the button variants
  const variantClasses = {
    primary: 'bg-green-700 hover:bg-green-900 border border-green-700 text-white font-semibold',
    outline: 'bg-transparent text-green-700 border border-green-700',
    link: 'text-green-700',
    reset: ''
  }


  /**
   * Sets the classes for the button based on the properties specified
   * @param {*} props 
   */
  function setClasses(props) {
    const classes = ['rounded-md'];
    
    // Set the button size classes
    switch (size) {
      case 'sm':
        classes.push(sizeClasses.sm);
        break;
      case 'md':
        classes.push(sizeClasses.md);
        break;
      case 'lg':
        classes.push(sizeClasses.lg);
        break;
      default:
        // If no size is set, but a variant is set that IS NOT the reset button
        if (!size && variant && variant !== 'reset') {
          classes.push(sizeClasses.md);
        }
    }
    
    // Set the variant classes
    switch (variant) {
      case 'primary':
        classes.push(variantClasses.primary);
        break;
      case 'outline':
        classes.push(variantClasses.outline);
        break;
      case 'link':
        classes.push(variantClasses.link);
        break;
      case 'reset':
        classes.push(variantClasses.reset);
        break;
      default:
        classes.push(variantClasses.reset);
    }

    // If the user has set any additional classes. Add them here.
    if (props.className) classes.push(props.className);

    return classes.join(' ');
  }

  return(
    <button 
      className={`btn ${setClasses(props)}`} 
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;