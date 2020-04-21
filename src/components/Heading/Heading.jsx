import * as React from 'react';

function Heading(props) {

  const {
    level,
    headingStyle,
    children
  } = props;

  const Tag = `h${(level) ? level : '1'}`;

  /**
   * This function defines classes for the element based on the heading level
   *
   * @param {*} level the user defined heading level
   */
  function defineClasses(level) {
    switch(level) {
      case '1':
        return 'text-2xl flex items-center w-full lg:text-5xl';
      case '2':
        return 'text-lg flex items-center w-full lg:text-4xl';
      default:
        return ''
    }
  }

  return(
    <Tag className={`${headingStyle} ${defineClasses(level)}`}>
      {children}
    </Tag>
  );
}

export default Heading;