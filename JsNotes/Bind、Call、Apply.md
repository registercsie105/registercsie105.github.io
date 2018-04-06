## Bind、Call、Apply

* bind()
```js
this.x = 9;    // this refers to global "window" object here in the browser
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();   
// returns 9 - The function gets invoked at the global scope

// Create a new function with 'this' bound to module
// New programmers might confuse the
// global var x with module's property x
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```

* call()

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  //if only Product(name, price)
  //cheese.name = cheese.price = undefined
  this.category = 'food';
}

function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}

var cheese = new Food('feta', 5); 
var fun = new Toy('robot', 40);
```

```js
var animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Fail' }
];

for (var i = 0; i < animals.length; i++) {
  (function(i) {
    this.print = function() {
      console.log('#' + i + ' ' + this.species
                  + ': ' + this.name);
    }
    this.print();
  }).call(animals[i], i);
  //first argument = this = animals[i]
}
```

```js
function foo(something) {
  console.log( this.a, something );
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = foo.bind( obj ); // bar is a function !

var b = bar( 3 ); // 2 3
console.log( b ); // 5

// foo.bind( obj )(3) = 5
```


* apply()
```javascript
var nums = [1,3,5,7,9,2];
var max = Math.max.apply(null,nums); // max = 9
```


> **Note:** While the syntax of this function is almost identical to that of **call()**, the fundamental difference is that **call()** accepts an argument list, while **apply()** accepts a single array of arguments.

