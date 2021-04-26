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

### 2.3props

1. props 是只读的。不管以何种方式声明组件（无论是函数组件还是类组件），都不可以修改 props。
   类似于纯函数，不能改变输入的值，输入的值相同，那么输出的值必须相同。
2. 对属性进行类型校验 static.propTypes
3. 属性的默认值 static.defaultProps
