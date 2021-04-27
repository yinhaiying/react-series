import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0
    }
  }
  handleClick = () => {
    // this.setState({ number: this.state.number + 1 });
    // console.log("第一次更新：", this.state.number)
    // this.setState({ number: this.state.number + 1 });
    // console.log("第二次更新：", this.state.number)
    this.setState({ number: this.state.number + 1 }, () => {
      console.log("最终获取的值:", this.state.number)
    });
    console.log("第一次更新：", this.state.number)
    this.setState({ number: this.state.number + 1 }, () => {
      console.log("最终获取的值:", this.state.number)
    });
    console.log("第二次更新：", this.state.number)

  }
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

let element = <Counter />

console.log(element)

ReactDOM.render(
  element,
  document.getElementById('root')
);



