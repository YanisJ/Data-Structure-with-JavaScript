// Node
function Node (data) {
  this.data     = data;
  this.parent   = null;
  this.children = [];
}

/*===========
 *
 *  Tree
 *
 *===========
 *
 * Methods:
 *
 *  traverseDF( callback )
 *  traverseBF( callback )
 *  contains( data, traversal )
 *  add ( child, parent )
 *  remove ( node, parent )
 *
 */

function Tree (data) {
  var node = new Node(data);
  this._root = node;
}

Tree.prototype.traverseDF = function (callback) {
  (function recurse (currentNode) {
    currentNode.children.forEach(function (el) {
      recurse(el);
    })
    callback(currentNode);
  })(this._root);
};

Tree.prototype.traverseBF = function (callback) {
  var queue = [];
  queue.push(this._root);
  currentTree = queue.shift();

  while (currentTree) {
    currentTree.children.forEach( function (el) {
      queue.push(el);
    });
    callback(currentTree);
    currentTree = queue.shift();
  }
};

Tree.prototype.contains = function (callback, traversal) {
  traversal.call(this, callback);
};

Tree.prototype.add =function (data, toData, traversal) {
  var child    = new Node(data),
      parent   = null,
      callback = function (node) {
        if (node.data === toData) {
          parent = node;
        }
      };
      this.contains(callback, traversal);
      if (parent) {
        parent.children.push(child);
        child.parent = parent;
      } else {
        throw new Error('Cannot add node to a non-existent parent.');
      }
};

Tree.prototype.remove = function (data, fromData, traversal) {
  var tree          = this,
      parent        = null,
      childToRemove = null,
      index;

  var callback = function (node) {
    if (node.data === fromData) {
      parent = node;
    }
  }

  function findIndex (arr, data) {
    var index;
    arr.forEach(function (el, i) {
      if (el.data === data) index = i;
    })
    return index;
  }

  this.contains(callback, traversal);

  if (parent) {
    index = findIndex(parent.children, data);
    if (index === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = parent.children.splice(index, 1);
    }
  } else {
    throw new Error('Parent does not exist.');
  }

  return childToRemove;
}

/*
 *===========
 *
 *  Test
 *
 *===========
 */
// var tree = new Tree('one');
// tree._root.children.push(new Node('two'));
// tree._root.children[0].parent = tree;
 
// tree._root.children.push(new Node('three'));
// tree._root.children[1].parent = tree;
 
// tree._root.children.push(new Node('four'));
// tree._root.children[2].parent = tree;
 
// tree._root.children[0].children.push(new Node('five'));
// tree._root.children[0].children[0].parent = tree._root.children[0];
 
// tree._root.children[0].children.push(new Node('six'));
// tree._root.children[0].children[1].parent = tree._root.children[0];
 
// tree._root.children[2].children.push(new Node('seven'));
// tree._root.children[2].children[0].parent = tree._root.children[2];

// tree.traverseBF(function (el) {
//   console.log(el.data);
// });

// tree.contains(function (node) {
//   if (node.data === 'two') {
//     console.log(node);
//   }
// }, tree.traverseBF);

var tree = new Tree('CEO');
tree.add('VP of Happiness', 'CEO', tree.traverseBF);
tree.add('VP of Finance', 'CEO', tree.traverseBF);
tree.add('VP of Sadness', 'CEO', tree.traverseBF);
 
tree.add('Director of Puppies', 'VP of Finance', tree.traverseBF);
tree.add('Manager of Puppies', 'Director of Puppies', tree.traverseBF);

tree.remove('VP of Happiness', 'CEO', tree.traverseBF);