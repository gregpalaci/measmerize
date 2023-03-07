import { readFile } from 'fs/promises';

const data = JSON.parse(
  await readFile(
    new URL('./input/nodes.json', import.meta.url)
  )
);


const insert = (array,index,value) => [...array.slice(0, index), value, ...array.slice(index)];
// take an array, place an item at an index, return a new array with the item at index then rest items

const remove = (array, index) => [...array.slice(0, index),...array.slice(index + 1)];
// opposite of above


const sortSiblings = (arr) => {
  let sortedArr = [];
   arr.map((element, index) => {
   
    const previousElementIndex = arr.findIndex((x) => x.previousSiblingId  === element.nodeId)

    if (parseInt(index) > parseInt(previousElementIndex)) {
      // if the index is more than the previous sibling index move the element and return copy of the new array
      sortedArr = insert(remove(arr, index), previousElementIndex, element)
  	}
    
        if (element.parentId) {
          // do this recursively for children
         sortedArr[index] = sortSiblings(element.children)
       } 
    
  })
   return sortedArr
}

const buildTree = (items, nodeId = null, link = 'parentId') =>
  items
  .filter(item => item[link] === nodeId) 
  .map(item => ({
    ...item,
    children: buildTree(items, item.nodeId) // map the levels of nodes to arrays aka tree, recursive for nested children
  }));


const result = sortSiblings(buildTree(data))

console.dir(result, { depth: Infinity })
