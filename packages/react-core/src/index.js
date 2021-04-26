import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import './index.css';
// import App from './App';


// function Greeting(props) {
//   return <h1>hello,{props.name}</h1>
// }
// const element = <Greeting name="world" />
class Welcome extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return <h1>hello,{this.props.name}</h1>
  }
}

let element = <Welcome name="title" />
ReactDOM.render(
  element,
  document.getElementById('root')
);


