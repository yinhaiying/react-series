import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import './index.css';
// import App from './App';

// const element = <h1 id="title">hello</h1>;
// console.log(element)
/*
{
  $$typeof: Symbol(react.element),
  key: null,
  props:{id: "title", children: "hello"},
  ref:null,
  type:"h1"
}



*/
function createElement(type, config = {}, ...children) {
  return {
    $$typeof: Symbol("react.element"),
    props: { ...config, children },
    type
  }
}
const element = createElement("h1", { id: "title" }, "hello")
console.log(element)
// ReactDOM.render(
//   element,
//   document.getElementById('root')
// );


