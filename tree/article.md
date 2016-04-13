# Data Structures With JavaScript: Tree

原文：[http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393](http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393)
文中的代码：[https://github.com/YanisJ/Data-Structure-with-JavaScript/blob/master/tree/tree.js](https://github.com/YanisJ/Data-Structure-with-JavaScript/blob/master/tree/tree.js)

在网页开发中，无论是对开发者还是用户而言，树都是非常常见的数据结构。每一位网页开发者都要编写 HTML 文件，当 HTML 文件被浏览器载入时，就会生成树结构 —— Document Object Model（DOM）。每一个用户在通过浏览器访问页面时，接收到的也同样是树结构的信息。

就在现在，你读到的这篇文章，就是以一个树结构在被你的浏览器渲染。你正在阅读的扎这个段落，是被 p 标签包裹的文字，p 标签被 body 标签包裹着，body 标签的外面还有 html 标签。

这些相互嵌套的数据，和家谱（family tree）非常类似：html 标签是父辈，body 标签是儿子，p 标签是 body 的儿子。如果这个比喻能帮助你理解树结构，那很好，接下来我们会经常采用比喻的形式来说明问题。

在这篇文章中，我们将使用两种不同的遍历法来生成一颗树：深度优先搜索（Depth-First Search）和广度优先搜索（Breadth-First Search）。（如果「遍历」这个词让你感到陌生，尽管把它想成「依某种次序访问树种的每一个元素」）每一种遍历方式，体现了与树结构的一种不同的交互方式。DFS 的思想是栈，BFS 是队列。

##树（深度优先搜索和广度优先搜索）
计算机科学中，树这种结构，利用节点，模拟出了一种阶梯状的数据。树中的每一个节点，都储存了数据，同时也指向了其他节点。

「节点」和「指向」这些术语对一些读者来说也许比较陌生，我们换个说法，将树想象成一个组织的结构图。结构图有个顶点（根节点），例如公司的 CEO。这个顶点直属的下级是一些其他的点，比如公司副总（VP）。

为了表示这种直属关系，我们用一个由 CEO 指向 VP 的箭头连接两者。CEO，VP 这样的点，就是「节点」，连接 CEO 和 VP 的箭头，就是一个 「指向」。如果要在这个组织结构图中建立更多的关系，我们只需要重复前面的工作，将一个节点指向另一个节点。

就概念而言，上面的例子让这些术语更具体。实际上，我们完全可以使用一个更技术的例子。让我们考虑一下 DOM。DOM 的最顶点，是 html 标签（根节点）。html 标签指向了 head 标签和 body 标签。这样的过程不停重复，直到 DOM 中每个元素都被包含进这个树结构位置。

###树的操作
每颗树都包含很多节点，节点又可以独立于树存在，于是我们将分别列出节点和树的相关操作：
####节点

- data：储存数据；
- parent：指出节点的父节点；
- children：指出节点的子节点。

####树

- _root：指出树的根节点；
- traverseDF(callback)：用深度优先搜索遍历整棵树；
- traverseBF(callback)：用广度优先搜索遍历整棵树；
- contains(data, traversal)：查询树中的节点；
- add(data, toData, traverse)：给树添加节点；
- remove(child, parent)：删除树中的节点。


###实现树结构
现在我们开始写代码。

####节点的属性
我们首先要定义节点和树的构造器，为实现做准备。

  function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
  }

每个节点的实例都包含三个属性：data，parent，children。第一个属性储存节点的数据，第二个属性指向另一个节点，第三个属性指向多个子节点。

####树的属性
现在，我们来定义树的构造器，其中会使用到节点构造器：

  function Tree(data) {
    var node = new Node(data);
    this._root = node;
  }

Tree 中只有两行代码。第一行创建了一个节点的实例；第二行将节点实例作为树的根节点。

定义树和节点只需要很少的代码。这几行代码对模拟阶梯状数据来说已经足够了。为了验证这一点，我们用一些示例数据来创建一颗树（当然，也间接的创建了节点）。

  var tree = new Tree('CEO');
  tree._root;
  // {data:'CEO', parent: null, children: []}

利用 parent 和 children 属性，我们可以添加节点作为 _root 的子节点，同时也将这些子节点的 parent 设为 _root。换句话说，我们已经可以模拟阶梯状数据了。

####树的方法
然后，我们会完成下面的 5 个方法：

##### 树

1. traverseDF(callback)
2. traverseBF(callback)
3. contains(data, traversal)
4. add(data, toData, traverse)
5. remove(child, parent)

由于每个方法的实现都需要遍历整棵树，我们先来实现遍历的方法。

##### 1 / 5：traverseDF(callback)
这个方法用深度优先搜索来遍历整棵树。

  Tree.prototype.traverseDF = function(callback) { 
    (function recurse(currentNode) {
      // step 2
      for (var i = 0, length = currentNode.children.length; i < length; i++) {
        // step 3
        recurse(currentNode.children[i]);
      }
      // step 4
        callback(currentNode);    
    // step 1
    })(this._root);
  };

traverseDF(callback) 有一个参数 callback。callback 是一个函数，将会在 traverseDF(callback) 中被调用。

traverseDF(callback) 中包含了另一个 function 叫做 recurse。这个 function 是一个递归 函数。换句话说，它将调用自身和自我终止。利用代码中的注解，我会描述 recurse 遍历整棵树的大致步骤。

下面是具体步骤：

1. 立刻调用 recurse 并且将根节点作为参数。此时，currentNode 指向根节点；
2. 进入 for 循环，从头开始，迭代 currentNode 的 children 属性中每一个子节点；
3. 在 for 循环中，调用 recurse，以 currentNode 的一个子节点为参数，这个字节点由 for 循环迭代控制；
4. 当 currentNode 不再有子节点，离开 for 循环，调用我们传递给 traverseDF(callback) 的 callback 函数。

第二部（自我终止），第三部（自我调用），第四部（callback）一直重复，直到遍历树中所有节点。

递归是一个比较难的题目，需要一整片文章才足以解释清楚。由于递归不是本文的重点——我们的焦点是实现树结构——我建议对递归缺乏足够了解的读者做以下两件事。

首先，试一试 traverseDF(callback)，尝试理解这个方法是如何工作的。然后，如果你需要我写一篇关于递归的文章，就在下面留言。

接下来的例子，是演示一颗树如何被 traverseDF(callback) 遍历。为了遍历一棵树，我需要首先建立一棵树。这里创建树的方式，不是什么好办法，但是可行。好的方式是使用 add(value) 方法，我们稍后将实现它。

  var tree = new Tree('one');
 
  tree._root.children.push(new Node('two'));
  tree._root.children[0].parent = tree;
   
  tree._root.children.push(new Node('three'));
  tree._root.children[1].parent = tree;
   
  tree._root.children.push(new Node('four'));
  tree._root.children[2].parent = tree;
   
  tree._root.children[0].children.push(new Node('five'));
  tree._root.children[0].children[0].parent = tree._root.children[0];
   
  tree._root.children[0].children.push(new Node('six'));
  tree._root.children[0].children[1].parent = tree._root.children[0];
   
  tree._root.children[2].children.push(new Node('seven'));
  tree._root.children[2].children[0].parent = tree._root.children[2];
   
  /*
   
  creates this tree
   
   one
   ├── two
   │   ├── five
   │   └── six
   ├── three
   └── four
       └── seven
   
  */

现在，我们调用 traverseDF(callback)。

  tree.traverseDF(function(node) {
      console.log(node.data)
  });
   
  /*
   
  logs the following strings to the console
   
  'five'
  'six'
  'two'
  'three'
  'seven'
  'four'
  'one'
   
  */
  
##### 2 / 5：traverseBF(callback)
这个方法利用广度优先搜索来遍历一棵树。

深度优先和广度优先的区别在与遍历所有节点的顺序不同。我们用上一节中建立的那颗树来说明这个问题。

  /*
 
   tree
   
   one (depth: 0)
   ├── two (depth: 1)
   │   ├── five (depth: 2)
   │   └── six (depth: 2)
   ├── three (depth: 1)
   └── four (depth: 1)
       └── seven (depth: 2)
   
   */

现在，我们传递同样的 callback 给 traverseBF(callback)。

  tree.traverseBF(function(node) {
      console.log(node.data)
  });
   
  /*
   
  logs the following strings to the console
   
  'one'
  'two'
  'three'
  'four'
  'five'
  'six'
  'seven'
   
  */

上面的 console 结果和树结构共同揭示了广度优先搜索的模式。从根节点开始；移动到下一层，从左至右遍历这一层级的所有节点。重复这一个过程直到最深一层。

对于广度优先搜索有了大致的理解，现在我们开始编码，实现这个方法。

  Tree.prototype.traverseBF = function (callback) {
    var queue = [];
    queue.push(this._root);
    currentTree = queue.shift();
    while (currentTree) {
      if (currentTree.children.length) {
        currentTree.children.forEach(function (node) {
          queue.push(node);
        })
        callback(currentTree);
        currentTree = queue.shift();
    }
    }
  }

我们对 traverseBF(callback) 的定义包含了大量的逻辑。因此，我会按步骤解释这些逻辑：

1. 建立一个数组 queue；
2. 将调用 traverseBF(callback) 的节点，添加进数组 queue；
3. 声明 currentNode 变量，把我们刚才加入 queue 中的节点赋值给这个变量；
4. 当 currentNode 指向一个节点，执行 while 循环；
5. 用 forEach 方法迭代 currentNode 的 children 数组；
6. 在 forEach 的回调函数中，将每一个子节点加入数组 queue；
7. 将 currentNode 作为参数传递给 callback；
8. 将 currentNode 的值重新设置，设置为 queue 中 shift 出的节点；
9. 直到 currentNode 不再指向一个节点——树种的每个节点都被访问过了——重复 4 到 8 步。

##### 3 / 5：contains(callback, traversal)

现在来定义一个帮助我们搜索树种特定值的方法。我已经定义了 contains(callback, traversal)，接收两个参数：需要搜索的数据和遍历的方法。

  Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
  };

在 contains(callback, traversal) 中，我们用到了一个叫 call 的方法，传递给它的参数是 this 和 callback。第一个参数把 traversal 和调用 contains(callback, traversal) 的那棵树绑定在了一起；第二个参数是树种每一个节点调用的函数。

想象以下场景，我们需要使用广度优先搜索，找到 data 等于一个特定数字的节点，并将其 console.log 出来。下面是代码：

  tree.contains(function(node){
   if (node.data === 'two') {
     console.log(node);
   }
  }, tree.traverseBF);

##### 4 / 5：add(data, toData, traversal)

我们现在有了一个在树中寻找特定节点的方法。在此基础上，我们再增加一个为特定节点添加子节点的方法。

  Tree.prototype.add = function(data, toData, traversal) {
    var child    = new Node(data),
        parent   = null,
        callback = function(node){
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

add(data, toData, traversal) 定义了三个参数。第一个参数 data，用来新建一个节点实例。第二个参数 toData，用来与树中的所有节点作对比。第三个节点 traversal，是需要使用的遍历方式。

add(data, toData, traversal) 中，我们声明了三个变量。第一个变量 child，初始化一个新的节点实例。第二个变量 parent，默认值是 null；当树中有节点与 toData 比对上了，parent 将会指向这个节点。将 parent 指向新节点，是第三个变量 callback 的工作。

callback 会把 toData 与所有节点的 data 属性作比较。如果 if 语句结果为真，那么将 parent 指向这个对比成功的节点。

每个节点与 toData 的比对过程，实际上发生在 contains(callback, traversal) 中。遍历的方式和 callback 都必须作为参数传递给 contains(callback, traversal)。

最后，如果 parent 确实存在于树中，就将 child push 到 parent.children 中；同时，也把 child 的 parent 属性指向 parent。否则，抛出一个错误。

下面是 add(data, toData, traversal) 的用例：

  var tree = new Tree('CEO');
  tree.add('VP of Happiness', 'CEO', tree.traverseBF);

  /*
 
  our tree
   
  'CEO'
  └── 'VP of Happiness'
   
  */

下面是一个更复杂的例子：

  var tree = new Tree('CEO');
   
  tree.add('VP of Happiness', 'CEO', tree.traverseBF);
  tree.add('VP of Finance', 'CEO', tree.traverseBF);
  tree.add('VP of Sadness', 'CEO', tree.traverseBF);
   
  tree.add('Director of Puppies', 'VP of Finance', tree.traverseBF);
  tree.add('Manager of Puppies', 'Director of Puppies', tree.traverseBF);
   
  /*
   
   tree
   
   'CEO'
   ├── 'VP of Happiness'
   ├── 'VP of Finance'
   │   ├── 'Director of Puppies'
   │   └── 'Manager of Puppies'
   └── 'VP of Sadness'
   
   */

##### 5 / 5：remove(data, fromData, traversal)

为了完善 Tree 的实现，我们再加入一个方法，remove(data, fromData, traversal)。这个方法会删除一个节点（包括这个节点下面的所有子节点），和在 DOM 中删除节点类似。

  Tree.prototype.remove = function(data, fromData, traversal) {
    var tree          = this,
        parent        = null,
        childToRemove = null,
        index;

    var callback = function (node) {
      if (node.data === fromData) {
        parent = node;
      }
    };

    this.contains(callback, traversal);

    if (parent) {
      index = findIndex(parent.children, data);

    if (index === undefined) {
      throw new Error('Node to remove dose not exist.');
    } else {
      childToRemove = parent.children.splice(index,1);      
    }
    } else {
      throw new Error('Parent dose not exist.');
    }

    return childToRemove;
  };

与 add(data, toData, traversal) 类似，remove 遍历一棵树，寻找包含第二个参数——fromData——的节点。如果找到这个节点，将 parent 指向这个节点。

这时，我们到达了第一个 if 语句。如果 parent 不存在，抛出错误。如果 parent 存在，以 parent.children 和我们需要删除节点的 data 为参数，调用 findIndex()。（findIndex() 会在下面定义。）

  function findIndex(arr, data) {
    var index;
    arr.forEach(function(el, i){
    if(el.data === data){
      index = i;
    }
    });
    return index;
  }

下面是 findIndex() 的逻辑。如果 parent.children 中任何一个节点的 data 属性和 data 匹配上，那么变量 index 就被赋予一个整数值。如果没有节点成功匹配，index 就保持 undefined 这个值。最后一行，将 index 作为返回值返回。

现在回到 remove(data, fromData, traversal)。如果 index 是 undefined，一个错误将被抛出。如果 index 有定义，那么用这个值，把要删除的节点从 parent.children 中删除；同时，将被删除的子节点赋给 childToRemove。

最后，返回 childToRemove。


## 结论

树模拟了阶梯状数据。我们周围很多事物都可以被描述为阶梯的形式，比如网页或者我们的家族。任何时候，你需要处理的阶梯状的数据，请考虑树结构。
