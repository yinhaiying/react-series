# react 核心知识总结

## jsx

### react 元素

react 元素是 react 应用的最小单位，它描述了你在屏幕上看到的内容，react 元素的本质其实是一个 js 对象。

```js
const element = <h1 id="title">hello</h1>;
console.log(element);
```

我们打印这个 element 可以发现它实际上就是一个普通的 js 对象。

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props:{id: "title", children: "hello"},
  ref:null,
  type:"h1"
}
```

事实上 react 中的元素就是通过 babel 转义得到的一个对象，我们可以看下 babel 转义的实现：

```js
const element = React.createElement("h1", { id: title }, 123);
```

我们可以看下它的核心其实是`createElement`方法，我们尝试自己实现一个简单的`createElement`方法。

```js
function createElement(type, config = {}, ...children) {
  return {
    $$typeof: Symbol("react.element"),
    props: { ...config, children },
    type,
  };
}
```

我们可以发现`createElement`实际上就是根据传入的几个参数，type,config 和 children 返回一个对象，这个对象其实就是虚拟 DOM。真正地渲染成真实 DOM 还需要依靠 ReactDOM。它能够保证浏览器中的 DOM 和你的虚拟 DOM 一致。

### JSX 表达式

表达式就是变量和操作符的集合，可以计算结果，比如常见的 a+b,1+2,let a = 1 等。
JSX 表达式就是在 JSX 中可以任意使用表达式，但是表达式要放在大括号里,也就是说在大括号中可以放置任何表达式。示例：

```js
let title = "world";
const element = (
  <h1 id="title">
    hello,<span>{title}</span> // title作为一个变量进行表达式
  </h1>
);
```

### React 如何区分 JSX 元素和 JSX 的表达式

凡是以`<`开头的被视为是 JSX 元素，以`{}`进行包裹的视为是 JSX 表达式。

### JSX 本质是一个对象，可以作为变量，参数，返回值

JSX 它的本质是一个对象，因此它可以作为一个变量，进行表达式计算；也可以作为函数的参数或者返回值。示例：

```js
function greeting(name) {
  if (name) {
    return <h1>hello,{name}</h1>;
  } else {
    return <h1>hello,world</h1>;
  }
}
const element = greeting("jsx");
ReactDOM.render(element, document.getElementById("root"));
```

如上所示，JSX 作为函数的返回值，最终被展示在页面中。其实，JSX 元素 作为返回值最常用的就是生成列表。

```js
let list = ["张三", "李四", "王五"];
const element = list.map((item) => {
  return <li>{item}</li>; // 作为函数的返回值
});
ReactDOM.render(<ul>{element}</ul>, document.getElementById("root"));
```

如上所示，由于 jsx 是用于描述 DOM 结构的，在页面中经常会存在各种各样的列表，这些列表都是通过数组数据展示得到的，因此，我们通常需要将数组转化成 JSX 列表，使用方法就是通过 map 进行转化。map 返回的就是一个 JSX 元素。

### JSX 元素的更新-JXS 元素的不可变性

1. JSX 元素是不可变对象，更新时创建新的
   JSX 元素是不可变的。我们都知道 JSX 元素实际上是一个这样的对象，

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props:{id: "title", children: "hello"},
  ref:null,
  type:"h1"
}
```

而对象是可以直接操作它的属性的，那么我们如果想要修改页面中的内容，比如把`id = "title"`变成`id = "hi"`，可以直接使用`element.props.id = "hi"`吗？我们可以尝试一下：

```js
const element = <h1 id="title">hello</h1>;
function update() {
  element.props.id = "hi"; // 使用对象的方式去修改页面中元素的内容
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(update, 1000);
```

我们可以发现页面中出现了报错：

```js
Uncaught TypeError: Cannot assign to read only property 'id' of object '#<Object>' // 不能修改只读属性
```

也就是说 JSX 元素的所有属性都是只读的，不能直接进行修改，如果我们要更新页面中的内容，只能创建新的 JSX 元素。
示例：

```js
function update() {
  const element = <h1 id="title">hello,{Date.now()}</h1>; // 每次更新时创建新的JSX元素
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(update, 1000);
```

2. React 只会更新必要的部分
   React 只会更新部分必要的 DOM，如果 DOM Diff 之后发现没有变化，那么就不会进行更新。

```js
function update() {
  const element = (
    <h1 id="title">
      <p>hello</p> // 这里不会进行更新 ,{Date.now()} // 只更新这里
    </h1>
  );
  ReactDOM.render(element, document.getElementById("root"));
}
```

## 二. 组件和 Props

1. 可以将 UI 切分成一些独立的，可复用的部件，这样就只需要专注于构建每一个单独的部件。
2. 组件从概念上类似于 Javasript 函数，它接收任意的入参（即 props），并返回用于描述页面展示内容的元素。

### 2.1 函数组件

- 函数组件接收一个单一的 props 对象，并返回一个 React 元素

```js
function Greeting(props) {
  // 接收props作为参数
  return <h1>hello,{props.name}</h1>; // 返回一个React元素
}
```

- 如何渲染函数组件

1. 封装函数组件的属性对象 props = {name:"xxx"}
2. 把 props 传递给`Greeting`函数。
3. 把这个 React 这个元素，渲染到真实 DOM 上。

```js
function Greeting(props) {
  return <h1>hello,{props.name}</h1>;
}
const element = <Greeting name="world" />;
ReactDOM.render(element, document.getElementById("root"));
```

### 2.2 类组件

- 类组件的 props 在 this 身上，需要一个 render 方法来返回一个 React 元素。

```js
class Welcome extends React.Component {
  render() {
    return <h1>hello,{this.props.name}</h1>;
  }
}

let element = <Welcome name="title" />;
```

- 如何渲染类组件

1. 封类组件的属性对象 props = {name:"xxx"}
2. 创建`Welcome`的实例，`new Welcome(props)`;传递 props 进去，通过`this.props = props`，默认调用 super()即可;
3. 调用实例的 render 方法，得到返回的 React 元素
4. 将 React 元素，也就是虚拟 DOM 渲染到真实 DOM 上。

```js
class Welcome extends React.Component {
  render() {
    return <h1>hello,{this.props.name}</h1>;
  }
}

let element = <Welcome name="title" />;
ReactDOM.render(element, document.getElementById("root"));
```

**为什么函数组件和类组件可以直接携程 JSX 形式了**
函数组件和类组件之所以可以直接写成 JSX，如下所示：

```js
const element = <Greeting name="world" />; // 函数组件
let element = <Welcome name="title" />; // 类组件
```

是因为实际上他们都是调用了`React.createElement`，这个方法会针对他们的`type`(即 createElement 的第一个参数)进行处理，返回相对应的虚拟 DOM。

### 2.3 props

1. props 是只读的。不管以何种方式声明组件（无论是函数组件还是类组件），都不可以修改 props。
   类似于纯函数，不能改变输入的值，输入的值相同，那么输出的值必须相同。
2. 对属性进行类型校验 static.propTypes
3. 属性的默认值 static.defaultProps

### 2.4 state

组件的状态：
组件的数据源有两个一个是属性`props`，来自父组件，不可修改。另外一个是状态，是内部初始化的，改变状态的唯一方式是通过`setState`，是自己内部控制的。属性和状态都会影响，属性和状态的改变都会引起视图的变化。

1. 只有在`constructor`中才可以给构造函数赋值。其他地方要改变`state`只能通过`setState`。

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), //  只能在contructor中进行赋值
    };
  }
  render() {
    return (
      <div>
        <h1>hello,state</h1>
        <h2>当前的时间是：{this.state.date.toLocalTimeString()}</h2>
      </div>
    );
  }
}
```

2. 修改状态，只能通过`setState`进行修改，不能直接修改 state。因为`setState`是包含了更新 UI 的操作，不仅仅是
   修改状态。

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }
  componentDidMount() {
    // 组件挂载完成
    this.timer = setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }
  render() {
    return (
      <div>
        <h1>hello,state</h1>
        <h2>当前的时间是：{this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}
```

3. setState 的更新可能是异步的。
   在事件处理函数中，调用`setState`并不会直接修改状态，而是先把`partialState`放入一个数组缓存起来，等事件执行结束后再统一更新。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0,
    };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    console.log("第一次更新：", this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log("第二次更新：", this.state.number);
  };
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
```

我们发现每次点击时，两次更新输出的值是相同的。这是因为在事件处理函数中，在事件处理函数中，调用`setState`并不会直接修改状态，而是先把`partialState`放入一个数组缓存起来，等事件执行结束后再统一更新。比如这样：

```js
let updateQueue = [];
updateQueue.push({ number: 1 });
updateQueue.push({ number: 1 });
this.state.number = 0; // 修改state.number
this.state = { number: 0, name: "counte" };
```

我们可以看下，这样的话最终输出的都是最后的`number`。
但是如果我们真的想要在事件函数中，获取到状态，那么在`setState`中传入一个回调函数。

```js
handleClick = () => {
  this.setState({ number: this.state.number + 1 }, () => {
    console.log("最终获取的值:", this.state.number);
  });
  console.log("第一次更新：", this.state.number);
  this.setState({ number: this.state.number + 1 }, () => {
    console.log("最终获取的值:", this.state.number);
  });
  console.log("第二次更新：", this.state.number);
};
```

注意：回调函数会等所有的队列清空以后才会执行，也就是等所有的 `setState` 执行完毕，这样的话我们获取的一定是最终的 state。因此，如果想拿到最后的状态 state，就可以使用回调函数。

## 三.事件

### 3.1 合成事件

在事件处理函数前，要把批量更新模式设置为 true。这样的话在函数执行过程中，就不会直接更新状态和页面了，只会缓存局部状态到 updateQueue 里面。等事件处理函数结束后，才会实际进行更新。也就是说**合成事件的目的是为了实现批量更新**

```js
function addEvent(dom, eventType, listener, componentInstance) {
  eventType = eventType.toLowerCase(); // onClick => onclick
  dom.eventStore = dom.eventStore ? dom.eventStore : {};
  dom.eventStore[eventType] = { listener, componentInstance }; // dom.eventStore.onclick = {}
  // 把事件委托给document
  document.addEventListener(eventType.slice(2), dispatchEvent, false);
}

function dispatchEvent(event) {
  // event原生DOM事件

  let { type, target } = event;
  while (target) {
    let { eventStore } = target;
    if (eventStore) {
      let { listener, componentInstance } = eventStore["on" + type]; // onclick
      if (listener) {
        if (componentInstance) {
          componentInstance.isBatchUpdate = true;
        }
        listener.call(null, event);
        if (componentInstance) {
          componentInstance.isBatchUpdate = false;
          componentInstance.forceUpdate();
        }
      }
    }
    target = target.parentNode;
  }
}
```

### 3.2 事件中的 this 处理

事件中的 this 处理，在 react 的事件中 this 应当指向组件的实例对象。有三种方式实现：

1. 公共属性箭头函数，回调里的 this 指针永远指向实例。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0,
    };
  }
  handleClick = () => {
    console.log(this); // this永远指向实例
  };
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
```

2. 匿名函数
   由于使用了匿名函数，那么箭头函数的 this 就是`render`的 this。而`render`方法始终是组件的实例才能调用。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0,
    };
  }
  handleClick() {
    console.log(this);
  }
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button
          onClick={() => {
            this.handleClick(); // 这里的this是render函数的this,而render函数都是组件实例在调用
          }}
        >
          +
        </button>
      </div>
    );
  }
}
```

3. 使用 bind 修改 this。
   我们不知道调用时函数的 this 的指向，但是我们可以在`constructor`中指定函数的`this`指向，这样的话无论何时调用，
   都是我们指定的 this 指向。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this);
  }
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
```

### 3.3 事件中的参数传递

由于事件的函数不能立即执行，因此我们无法直接给函数添加参数，我们需要在事件函数外面包裹一个函数，用于接收参数。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (event, num) => {
    this.setState({ number: this.state.number + num });
  };
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button
          onClick={(event) => {
            this.handleClick(event, 2);
          }}
        >
          +
        </button>
      </div>
    );
  }
}
```
