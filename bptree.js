BPTree = function(k)
{
	this.data = []
	,
	this.link = []
	,
	this.parent = undefined
	,
	this.getK = function()
	{
		return k;
	}
};

var root;

function searchInsertLocation(tree, val)
{
	if(tree.data.length == 0)
	{
		return [tree, 0];
	}
	
	for(var i = 0; i < tree.data.length; i++)
	{
		if(tree.data[i] == val)
		{
			return undefined;
		}
		
		if(tree.data[i] > val)
		{
			if(tree.link[i])
			{
				return searchInsertLocation(tree.link[i], val);
			}
			
			return [tree, i];
		}
	}
	
	if(tree.link[tree.link.length - 1])
	{
		return searchInsertLocation(tree.link[tree.link.length - 1], val);
	}
	
	return [tree, tree.data.length];
}

function searchWrapper(tree, val)
{
	var start = +new Date();
	
	var result = search(tree, val);
	
	console.info('search took ' + ((+new Date()) - start) + 'ms.');
	
	return result;
}

function search(tree, val)
{
	if(tree)
	{
		for(var i = 0; i < tree.data.length; i++)
		{
			if(tree.data[i] == val && tree.link.length == 0)
			{
				return [tree, i];
			}
			
			if(tree.data[i] > val)
			{
				return search(tree.link[i], val);
			}
		}
		
		return search(tree.link[tree.link.length - 1], val);
	}
}

function rebalance(tree)
{
	var left =
	{
		data : tree.data.slice(0, parseInt(root.getK() / 2))
		,
		link : tree.link.slice(0, parseInt(root.getK() / 2) + 1)
	};
	
	var right =
	{
		data : tree.data.slice(parseInt(root.getK() / 2) + ((tree.link.length == 0) ? 0 : 1))
		,
		link : tree.link.slice(parseInt(root.getK() / 2) + 1)
	};
	
	var middle =
	{
		data : [tree.data[parseInt(root.getK() / 2)]]
		,
		link : [left, right]
	};
	
	if(tree.link.length == 0)
	{
		left.left = tree.left;
		left.right = right;
		right.left = left;
		right.right = tree.right;
		
		if(tree.left)
		{
			tree.left.right = left;
		}
		
		if(tree.right)
		{
			tree.right.left = right;
		}
	}
	
	for(var i = 0; i < left.link.length; i++)
	{
		left.link[i].parent = left;
	}
	
	for(var i = 0; i < right.link.length; i++)
	{
		right.link[i].parent = right;
	}
	
	if(tree.parent)
	{
		var i;
		for(i = 0; i < tree.parent.data.length; i++)
		{
			if(tree.parent.data[i] > middle.data[0])
			{
				break;
			}
		}
		
		insertValueIntoLeaf(tree.parent, i, middle.data[0], middle.link);
		
		if(!left.parent)
		{
			left.parent = tree.parent;
		}
		
		if(!right.parent)
		{
			right.parent = tree.parent;
		}
	}
	else
	{
		left.parent = middle;
		right.parent = middle;
		middle.getK = root.getK;
		
		root = middle;
	}
}

function insertIntoArray(arr, index, val, replace)
{
	var lVal = val;
	var lIndex = index;
	var temp = arr[lIndex];
	
	while(temp && !replace)
	{
		arr[lIndex] = lVal;
		lIndex++;
		lVal = temp;
		temp = arr[lIndex];
	}
	
	arr[lIndex] = lVal;
}

function insertValueIntoLeaf(leaf, index, val, newLinks)
{
	insertIntoArray(leaf.data, index, val);
	
	if(newLinks)
	{
		insertIntoArray(leaf.link, index, newLinks[0], true);
		insertIntoArray(leaf.link, index + 1, newLinks[1]);
	}

	if(leaf.data.length > root.getK())
	{
		rebalance(leaf);
	}
}

function insert(tree, val)
{
	var result = searchInsertLocation(tree, val);
	
	if(result)
	{
		insertValueIntoLeaf(result[0], result[1], val);
	}
}

function assignParents(tree)
{
	if(tree)
	{
		for(var i in tree.link)
		{
			tree.link[i].parent = tree;
			assignParents(tree.link[i]);
		}
	}
}

function renderNode(tree)
{
	var result = '';
	
	result += '[';
	for(var i = 0; i < tree.data.length; i++)
	{
		result += tree.data[i];
		
		if(i + 1 < tree.data.length)
		{
			result += ', ';
		}
	}
	result += ']';
	
	if(tree.link.length > 0)
	{
		result += lHor;
	}
	
	return result;
}

function render(tree, level, space)
{
	if(level > 0)
	{
		var result = '';
		var spaces = '';
		
		for(var i = 0; i < space; i++)
		{
			spaces += '&nbsp;';
		}
		
		result += renderNode(tree);
		
		for(var i = 0; i < tree.link.length; i++)
		{
			result += render(tree, level + 1, i == 0 ? 0 : result.length);
		}
		
		return result;
	}
	else
	{
		var result = renderNode(tree);
		
		for(var i = 0; i < tree.link.length; i++)
		{
			result += render(tree, 1, i == 0 ? 0 : result.length);
		}
		
		return result;
	}
}

function testRandom(count, k)
{
	var start = +new Date();
	var elementCount = count;
	window.root = new BPTree(k);
	
	for(var i = 1; i < elementCount; i++)
	{
		insert(root, parseInt(Math.random() * elementCount) + 1);
	}
	
	var timePassed = (+new Date()) - start;
	console.info(elementCount + " elements indexed in " + timePassed + "ms.");
}

function test(count, k)
{
	var start = +new Date();
	var elementCount = count;
	window.root = new BPTree(k);
	
	for(var i = 1; i < elementCount; i++)
	{
		insert(root, i);
	}
	
	var timePassed = (+new Date()) - start;
	console.info(elementCount + " elements indexed in " + timePassed + "ms.");
}
