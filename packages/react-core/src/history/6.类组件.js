import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
class Welcome extends React.Component {
  render() {
    return <h1>hello,{this.props.name}</h1>
  }
}

let element = <Welcome name="title" />
ReactDOM.render(
  element,
  document.getElementById('root')
);
