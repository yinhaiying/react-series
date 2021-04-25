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
