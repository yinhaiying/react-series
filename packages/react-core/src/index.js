import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    }
  }
  componentDidMount() {   // 组件挂载完成
    this.timer = setInterval(() => {
      this.setState({ date: new Date() })
    }, 1000)
  }
  render() {
    return (
      <div>
        <h1>hello,state</h1>
        <h2>当前的时间是：{this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

let element = <Clock />

console.log(element)

ReactDOM.render(
  element,
  document.getElementById('root')
);



