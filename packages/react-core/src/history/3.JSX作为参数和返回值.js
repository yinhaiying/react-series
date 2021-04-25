import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import './index.css';
// import App from './App';

function greeting(name) {
  if (name) {
    return <h1>hello,{name}</h1>
  } else {
    return <h1>hello,world</h1>
  }
}

let list = ["张三", "李四", "王五"];
const element = list.map((item) => {
  return <li>{item}</li>
})
ReactDOM.render(
  <ul>{element}</ul>,
  document.getElementById('root')
);


