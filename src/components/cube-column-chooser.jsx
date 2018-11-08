import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useClickOutside from './use/click-outside';
import './cube-column-chooser.pcss';

function findAttribute(event, attrName) {
  let el = event.target;
  while (!!el && !el.getAttribute(attrName)) {
    el = el.parentElement;
  }
  const field = el && el.getAttribute(attrName);
  return field;
}

export default function CubeColumnChooser({
  alignTo, arrowStyle, chooseColumn, selectableColumns,
}) {
  const [filter, setFilter] = useState('');
  const inputRef = useRef(null);
  const selfRef = useRef(null);

  useClickOutside(selfRef, true, () => {
    chooseColumn(null);
  });

  const filteredColumnsOptions = selectableColumns.filter(item => item.title.toLowerCase().indexOf(filter) >= 0);


  function updateFilter(e) {
    const { value } = e.target;
    setFilter(value.toLowerCase());
  }

  function selectRow(e) {
    const title = findAttribute(e, 'data-title');
    chooseColumn(selectableColumns.find(c => c.title === title));
  }

  const itemElement = filteredColumnsOptions.map(column => (
    <li className="expression" key={`${column.title}:${column.type}`} data-title={column.title}>
      <span className="expression-title">{column.title}</span>
      <span className="expression-type">{column.type}</span>
    </li>
  ));


  const rect = alignTo.getBoundingClientRect();
  let popupStyle;
  if (arrowStyle === 'arrowRight') {
    popupStyle = { left: rect.left + rect.width / 2 - 18 * 8, top: rect.top - 43 * 8 };
  } else {
    popupStyle = { left: rect.left + rect.width / 2, top: rect.top - 43 * 8 };
  }

  return (
    <div className={`cube-column-chooser ${arrowStyle}`} style={popupStyle} ref={selfRef}>
      <div className="input-wrapper">
        <span className="fx">fx</span>
        <input type="text" autoFocus ref={inputRef} onKeyUp={e => updateFilter(e)} />
      </div>
      <ul className="expression-list" onClick={e => selectRow(e)}>
        {itemElement}
      </ul>
    </div>
  );
}
CubeColumnChooser.propTypes = {
  alignTo: PropTypes.any.isRequired,
  arrowStyle: PropTypes.string,
  chooseColumn: PropTypes.func.isRequired,
  selectableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CubeColumnChooser.defaultProps = {
  arrowStyle: '',
};
