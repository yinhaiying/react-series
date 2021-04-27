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
