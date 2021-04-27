# 实现一个简易的 react

## 一.实现 React.createElement

我们都知道 jsx 的语法实际上是`React.createElement`的语法糖，比如：

```js
let element = (
  <h1 className="title" style={{ color: "red" }}>
    hello <span>world</span>
  </h1>
);
```

它实际上内部实现是：

```js
let element = React.createElement(
  "h1",
  {
    className: "title",
    style: {
      color: "red",
    },
  },
  "hello",
  React.createElement("span", null, "world")
);
```

因此，我们第一步实际上就是实现`React.createElement`方法。

```js
function createElement(type, config = {}, ...children) {
  let props = { ...config, children };
  return {
    type,
    props,
  };
}
```

## 二.实现 ReactDOM.render

我们知道通过`React.createElement`得到的只是一个虚拟 DOM，我们还需要通过它的`type`，将其创建成真实的 DOM，然后挂载到页面中，如下所示，是我们经常使用的`render`方法。

```js
ReactDOM.render(element, document.getElementById("root"));
```

因此，接下来我们需要实现的就是`ReactDOM.render`方法。

### 2.1 type 是字符串

如果 type 类型是一个字符串，说明是普通 HTML 元素，可以直接通过`document.createElement(type)`进行创建。

```js
function render(element, container) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let { type, props } = element;
  let dom = document.createElement(type);
  for (let propName in props) {
    // 循环每一个属性
    if (propName === "children") {
      props.children.forEach((child) => render(child, dom));
    } else if (propName === "className") {
      dom.className = props[propName];
    } else if (propName === "style") {
      let styleObj = props[propName];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom.setAttribute(propName, props[propName]);
    }
  }
  container.appendChild(dom);
}
```

### 2.2 type 是一个函数——函数组件

我们知道组件可以是普通的 HTML 元素(type 就是字符串)，也可以是函数式组件或者类组件。我们可以看下如果使用函数组件，`createElement`的第一个参数是什么。

```js
const element = <Greeting name="world" />;
```

经过 babel 转义后是：

```js
const element = React.createElement(Greeting, { name: "world" });
```

我们可以看到**第一个参数是函数 Greeting**。
也就是说 type 可能是一个函数。如果是一个函数，那么我们要拿到的虚拟 DOM 应该是函数执行后返回的结果。
我们拿到这个结果，才能够拿到新的`type`和`props`。

```js
function render(element, container) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let type = element.type;
  let props = element.props;
  if (typeof type === "function") {
    element = type(props); // 函数组件执行后悔返回一个react元素
    type = element.type; // 重新得到react元素的类型
    props = element.props; // 重新得到react元素的属性
  }

  let dom = createDom(type, props);
  container.appendChild(dom);
}
```

### 2.3 type 是一个函数——类组件

我们知道 type 是一个函数，但是它也可能是一个类组件，因为 js 中没有类的概念，类编译后也会变成函数，因此需要增加一个静态属性`isComponent`来区分是类组件还是函数组件。

```js
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
}
```

类组件的渲染，需要创建类的实例，然后调用`render`方法才能够得到虚拟 DOM。

```js
function render(element, container) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let type = element.type;
  let props = element.props;
  let isReactComponent = type.isReactComponent;
  if (isReactComponent) {
    let componentInstance = new type(props);
    element = componentInstance.render();
    type = element.type; // 重新得到react元素的类型
    props = element.props; // 重新得到react元素的属性
  } else if (typeof type === "function") {
    element = type(props); // 函数组件执行后悔返回一个react元素
    type = element.type; // 重新得到react元素的类型
    props = element.props; // 重新得到react元素的属性
  }
  let dom = createDom(type, props);
  container.appendChild(dom);
}
```

## 三.实现 state

### 3.1 React 中 state 的使用

我们首先看下 state 的使用情况：

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

通过上面的代码，我们可以看到代码的核心是去实现`setState`方法，我们可以发现`setState`是在`this`身上，因此，这个方法是通过`React.component`继承来的。因此，我们接下来也需要在`React.component`身上实现`setState`方法。
我们先确定一下 setState 的功能：

1. setState 包含了刷新页面的操作，就是让真实 DOM 和虚拟 DOM 保持一致。因此，不要直接修改 state
2. setState 的更新可能会被合并。也就是 `setState` 传入的对象会跟老的对象进行合并，并不会直接覆盖。
   - 老的有新的有则更新
   - 老的没有，新的没有则添加
   - 老的有，新的没有则保留
     也就是说 setState 只能添加和修改，不能删除
3. setState 的更新可能是异步的。
   在事件处理函数中，调用`setState`并不会直接修改状态，而是先把`partialState`放入一个数组缓存起来，等事件执行结束后再统一更新。

### 3.2 state 的简单实现

1. 修改 state
   修改 state 主要是判断是否有批量，如果没有批量，那么直接操作得到新的 state 并合并之前的 state。

```js
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updateQueue = []; // 存放临时的更新队列
    this.isBatchUpdate = false; // 当前是否处于批量更新模式
  }
  setState(partialState) {
    this.updateQueue.push(partialState);
    if (!this.isBatchUpdate) {
      // 如果当前不是处于批量更新模式，则直接更新
      this.forceUpdate();
    }
  }
  forceUpdate() {
    this.state = this.updateQueue.reduce((accumulate, current) => {
      let nextState =
        typeof current === "function" ? current(accumulate) : current;
      accumulate = { ...accumulate, ...nextState };
      return accumulate;
    }, this.state);
    this.updateQueue.length = 0;
    // 修改状态后，更新组件
    // updateComponent(this);
  }
}
```

2. 更新视图
   `setState`不仅能够修改`state`，还能更新视图，更新视图的步骤如下：

- 根据新额 state 得到新的虚拟 DOM，也就是调用 render 方法
- 根据新的虚拟 DOM，渲染新的真实 DOM
- 用新的真实 DOM，替换原来的 DOM

```js
export function updateComponent(componentInstance) {
  let element = componentInstance.render(); // 根据新的props和state得到新的虚拟DOM。
  let { type, props } = element;
  let dom = createDom(type, props); // 根据新的虚拟DOM，创建新的真实DOM。
  // 拿到之前的节点的父节点，将老的dom节点替换成新的dom节点。
  componentInstance.dom.parentNode.replaceChild(dom, componentInstance.dom); // 将老的DOM替换成新的DOM
  componentInstance.dom = dom;
}
```

### 3.3 state 的回调函数 callback 的实现

```js
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updateQueue = []; // 存放临时的更新队列
    this.isBatchUpdate = false; // 当前是否处于批量更新模式
    this.callbacks = []; // 收集setState的所有回调函数
  }
  setState(partialState, callback) {
    this.updateQueue.push(partialState);
    this.callbacks.push(callback);
    if (!this.isBatchUpdate) {
      // 如果当前不是处于批量更新模式，则直接更新
      this.forceUpdate();
    }
  }
  forceUpdate() {
    this.state = this.updateQueue.reduce((accumulate, current) => {
      let nextState =
        typeof current === "function" ? current(accumulate) : current;
      accumulate = { ...accumulate, ...nextState };
      return accumulate;
    }, this.state);
    this.updateQueue.length = 0;
    // 修改状态后，更新组件
    // updateComponent(this);
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
  }
}
```

## 四.事件

### 4.1 合成事件

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

### 4.2 事件中的 this 处理

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

### 4.3 事件中的参数传递

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

## 五. 生命周期函数

生命周期函数是在组件的各个阶段执行的回调函数。因此，我们只需要在组件的各个阶段判断是否存在回调函数，如果有就执行。
注意：**生命周期函数只在类组件中有**

### 5.1 componentWillMount 和 componentDidMount 的实现

```js
function render(element, container, componentInstance) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let type = element.type;
  let props = element.props;
  let isReactComponent = type.isReactComponent;
  if (isReactComponent) {
    componentInstance = new type(props);
    element = componentInstance.render();

    // 添加componentWillMount钩子函数的处理
    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount();
    }
    type = element.type; // 重新得到react元素的类型
    props = element.props; // 重新得到react元素的属性
  } else if (typeof type === "function") {
    element = type(props); // 函数组件执行后悔返回一个react元素
    type = element.type; // 重新得到react元素的类型
    props = element.props; // 重新得到react元素的属性
  }
  let dom = createDom(type, props, componentInstance);
  if (isReactComponent && componentInstance) {
    // 将类组件的实例的dom指向这个类组件创建出来的真实DOM。
    componentInstance.dom = dom;
  }
  container.appendChild(dom);
  // 添加componentDidMount钩子
  if (
    isReactComponent &&
    componentInstance &&
    componentInstance.componentDidMount
  ) {
    componentInstance.componentDidMount();
  }
}
```

## 六.ref

`ref`即`reference`引用，它用于访问 react 中的 DOM 节点或者创建的组件实例。

### 6.1 ref 的使用

ref 可以是

1. 字符串 this.refs = {key:value} key 是字符串，值就是这个虚拟 DOM 在浏览器中的真实 DOM。
2. 函数

```js
class Calculator extends React.Component {
  handleAdd = (event) => {
    let a = this.a.value; // 使用时直接通过this.a进行获取即可。不需要再通过refs
    let b = this.b.value;
    this.refs.result.value = parseInt(a) + parseInt(b);
  };
  render() {
    return (
      <div>
        <input ref={(node) => (this.a = node)} />+ // 是一个函数
        <input ref={(node) => (this.a = node)} />
        <button onClick={this.handleAdd}> = </button>
        <input ref="result" />
      </div>
    );
  }
}
```

3. 对象(最常用)

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef(); // {current:null}
    this.b = React.createRef(); // {current:null}
    this.result = React.createRef(); // {current:null}
  }
  handleAdd = (event) => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = parseInt(a) + parseInt(b);
  };
  render() {
    return (
      <div>
        <input ref={this.a} />+
        <input ref={this.b} />
        <button onClick={this.handleAdd}> = </button>
        <input ref={this.result} />
      </div>
    );
  }
}
```

### 6.2 ref 的实现

ref 的实现实际上就是在生成真实 DOM 之后，根据是否有 ref 属性，以及 ref 属性的类型做不同的操作

```js
function createDom(type, props, componentInstance) {
  let dom = document.createElement(type);
  for (let propName in props) {
    // 循环每一个属性
    if (propName === "children") {
      if (Array.isArray(props.children)) {
        props.children.forEach((child) =>
          render(child, dom, componentInstance)
        );
      } else {
        render(props.children, dom);
      }
    } else if (propName === "className") {
      dom.className = props[propName];
    } else if (propName === "style") {
      let styleObj = props[propName];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (propName.startsWith("on")) {
      // dom[propName.toLowerCase()] = props[propName];
      // dom：绑定的真实DOM元素， propName:onclick listener:handleClick
      addEvent(dom, propName, props[propName], componentInstance);
    } else {
      dom.setAttribute(propName, props[propName]);
    }
  }
  // 处理ref
  if (props.ref) {
    if (typeof props.ref === "string") {
      componentInstance.refs[props.ref] = dom;
    } else if (typeof props.ref === "function") {
      props.ref.call(componentInstance, dom);
    } else if (typeof props.ref === "object") {
      props.ref.current = dom;
    }
  }
  return dom;
}
```
