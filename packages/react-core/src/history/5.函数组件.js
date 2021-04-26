import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库


function Greeting(props) {
  return <h1>hello,{props.name}</h1>
}
const element = <Greeting name="world" />

ReactDOM.render(
  element,
  document.getElementById('root')
);
