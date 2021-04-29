import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


class MouseTraker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 }
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}


/*
如果我们不确定组件里面是什么，也就是说组件的children是动态变化的，我们可以使用this.children来进行渲染，如果需要传值，
那么this.children可以是一个函数。

方法一：组件的children是一个函数
ReactDOM.render(
  <MouseTraker >
    {
      props => {
        return (
          <>
            <p>移动鼠标，记录位置</p>
            <p>当期鼠标位置：{props.x},{props.y}</p>
          </>
        )

      }
    }
  </MouseTraker>,
  document.getElementById('root')
);


*/

ReactDOM.render(
  <MouseTraker render={
    props => {
      return (
        <>
          <p>移动鼠标，记录位置</p>
          <p>当期鼠标位置：{props.x},{props.y}</p>
        </>
      )
    }
  } />,

  document.getElementById('root')
);

