## Reduce

```js
var mylist = [1,3,2,4,5];
var sum = mylist.reduce(function(a, b) { return a + b; });
var sum2 = mylist.reduce( (a,b) => a+b );
//sum = sum2 = 1+3+2+4+5 = 15
```

```js
var names = ['Alice','Peter','Jimmy','Alice'];
var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames; 
}, {}); // {} = init value
// result: {Alice: 2, Peter: 1, Jimmy: 1}

// if we set {Alice: '12'}
// result will be {Alice: 14, Peter: 1, Jimmy: 1}
```