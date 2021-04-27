// import React from 'react';  // React核心库 提供react组件等
// import ReactDOM from 'react-dom';  // DOM渲染库
import React from './my-react/react';  // React核心库 提供react组件等
import ReactDOM from './my-react/react-dom';  // DOM渲染库


// let element = <h1 className="title" style={{ color: "red" }}>hello <span>world</span></h1>

let element = React.createElement("h1", {
  className: "title",
  style: {
    color: "red"
  }
}, "hello", React.createElement("span", null, "world"))
console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
);



