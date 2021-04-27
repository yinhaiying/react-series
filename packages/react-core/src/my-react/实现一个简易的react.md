# 实现一个简易的 react

## 实现 React.createElement

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

## 实现 ReactDOM.render

我们知道通过`React.createElement`得到的只是一个虚拟 DOM，我们还需要通过它的`type`，将其创建成真实的 DOM，然后挂载到页面中，如下所示，是我们经常使用的`render`方法。

```js
ReactDOM.render(element, document.getElementById("root"));
```

因此，接下来我们需要实现的就是`ReactDOM.render`方法。

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
