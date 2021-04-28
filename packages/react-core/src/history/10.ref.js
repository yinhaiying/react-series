import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.a = React.createRef();  // {current:null}
    this.b = React.createRef();  // {current:null}
    this.result = React.createRef();  // {current:null}
  }
  handleAdd = (event) => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = parseInt(a) + parseInt(b);
  }
  render() {
    return (
      <div>
        <input ref={this.a} />+
        <input ref={this.b} />
        <button onClick={this.handleAdd}> = </button>
        <input ref={this.result} />
      </div>
    )
  }
}
let element = <Calculator />;
console.log("......", element)

ReactDOM.render(
  element,
  document.getElementById('root')
);



