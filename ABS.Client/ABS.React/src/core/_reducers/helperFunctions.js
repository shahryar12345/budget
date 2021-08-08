export function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  //console.log('update object', oldObject, newValues);
//   const updatedObj = merge_options ({...oldObject}, {...newValues})
//   console.log('updated object with values ', updatedObj)
  //return updatedObj;
  const updatedObj = Object.assign({}, oldObject, newValues)
//  console.log('ya Allah ',updatedObj)
  return updatedObj;
}

export function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      // Since we only want to update one item, preserve all others as they are now
      return item
    }
    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item)
    return updatedItem
  })
  return updatedItems
}

function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname2 in obj2) { obj3[attrname2] = obj2[attrname2]; }
    return obj3;
}