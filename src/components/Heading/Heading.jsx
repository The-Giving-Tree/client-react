import * as React from 'react';
import './Heading.css';

function Heading(props) {

  const {
    level,
    children,
    className
  } = props;

  const Tag = `h${(level) ? level : '1'}`;

  return(
    <Tag className={`${className}`}>
      {children}
    </Tag>
  );
}

export default Heading;