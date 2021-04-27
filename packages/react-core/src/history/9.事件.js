// import React from 'react';  // React核心库 提供react组件等
// import ReactDOM from 'react-dom';  // DOM渲染库
import React from './my-react/react';  // React核心库 提供react组件等
import ReactDOM from './my-react/react-dom';  // DOM渲染库
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "counter",
      number: 0
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (event, num) => {
    this.setState({ number: this.state.number + num })
  }
  render() {
    return (
      <div>
        <h1>count:{this.state.number}</h1>
        <button onClick={(event) => { this.handleClick(event, 2) }}>+</button>
      </div>
    );
  }
}

let element = React.createElement(Counter, {})

console.log("111", element)

ReactDOM.render(
  element,
  document.getElementById('root')
);



