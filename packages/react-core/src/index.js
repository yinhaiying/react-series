import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import './index.css';
// import App from './App';





function update() {
  const element = <h1 id="title">
    <p>hello</p>
    ,{Date.now()}</h1>
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(update, 1000)

