import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import './index.css';
// import App from './App';

let title = "world";
const element = <h1 id="title">hello,<span>{title}</span></h1>;
console.log(element)
/*
{
  $$typeof: Symbol(react.element),
  key: null,
  props:{id: "title", children: "hello"},
  ref:null,
  type:"h1"
}
*/


console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
);


