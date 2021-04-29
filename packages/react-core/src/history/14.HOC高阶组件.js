import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


function withLogger(OldComponent) {
  return class extends React.Component {
    start = null;
    UNSAFE_componentWillMount() {
      this.start = Date.now();
    }
    componentDidMount() {
      console.log(Date.now() - this.start);
    }
    render() {
      return <OldComponent {...this.props} />
    }
  }
}

class Hello extends React.Component {
  render() {
    return (
      <div>hello,{this.props.id}</div>
    )
  }
}

let NewHello = withLogger(Hello)
ReactDOM.render(
  <NewHello id="world" />,
  document.getElementById('root')
);



