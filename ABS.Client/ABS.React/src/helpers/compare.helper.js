export const compareFunction = (direction, item1, item2) => {

  let sortValue;
  switch (direction) {
    case 'hierarchical':
      sortValue = compareHierarchical(item1, item2);
      break;
    case 'ascending':
      sortValue = compareAscending(item1, item2);
      break;
    case 'descending':
      sortValue = compareDescending(item1, item2);
      break;
    default:
      throw new Error(`Sort type '${direction}' is invalid.`);
  }
  return sortValue;
};

const compareHierarchical = (item1, item2) => {

  let direction;
  if (!isNaN(item1) && !isNaN(item2)) {
    direction = item1 - item2;
  } else if (item1.toString().toUpperCase() < item2.toString().toUpperCase()) {
    direction = -1;
  } else if (item1.toString().toUpperCase() > item2.toString().toUpperCase()) {
    direction = 1;
  } else {
    direction = 0;
  }

  return direction;
};

const compareAscending = (item1, item2) => {

  let direction;
  if (!isNaN(item1) && !isNaN(item2)) {
    direction = item1 - item2;
  } else if (item1.toString().toUpperCase() < item2.toString().toUpperCase()) {
    direction = -1;
  } else if (item1.toString().toUpperCase() > item2.toString().toUpperCase()) {
    direction = 1;
  } else {
    direction = 0;
  }
  
  return direction;
};

const compareDescending = (item1, item2) => {

  let direction;
  if (!isNaN(item1) && !isNaN(item2)) {
    direction = item2 - item1;
  } else if (item1.toString().toUpperCase() > item2.toString().toUpperCase()) {
    direction = -1;
  } else if (item1.toString().toUpperCase() < item2.toString().toUpperCase()) {
    direction = 1;
  } else {
    direction = 0;
  }
  
  return direction;
};
