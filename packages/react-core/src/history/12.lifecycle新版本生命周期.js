import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


class Counter extends React.Component {
  static defaultProps = {
    name: "hello"
  }
  constructor(props) {
    super();
    this.props = props;
    this.state = { number: 0 };
    console.log("1:Counter constructor:构造函数")
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
  }
  UNSAFE_componentWillMount() {
    console.log("2:Counter componentWillMmount:组件将要挂载")
  }
  render() {
    console.log("3:Counter render:生成虚拟DOM")
    return (
      <div>
        <p>Counter:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
        <hr />
        {this.state.number < 1000 ? <SubCounter count={this.state.number} /> : null}
      </div>
    )
  }
  componentDidMount() {
    console.log("4:Counter componentDidMount:组件挂载完成")
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("5:Counter shouleComponentUpdate，询问用户组件是否要更新");
    return nextState.number % 2 === 0;  // 偶数更新，奇数不更新
  }
  UNSAFE_componentWillUpdate() {
    console.log("6:Counter componentWillUpdate:组件将要更新")
  }
  componentDidUpdate() {
    console.log("7:Counter componentDidUpdate:组件更新完成")
  }
}

class SubCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 0
    }
  }
  // nextProps 新的props属性对象 prevState 老的状态state对象
  static getDerivedStateFromProps(nextProps, prevState) {
    let { count } = nextProps;
    return {
      n: count * 2
    }
  }
  // 当父组件将要传递给子组件新的属性时
  // UNSAFE_componentWillReceiveProps() {
  //   console.log("1:SubCount:componentWillReceiveProps")
  // }
  render() {
    console.log("2:SubCounter:render")
    return (
      <div>
        <p>SubCount:{this.state.n}</p>
      </div>
    )
  }

  componentWillUnmount() {
    console.log("3:SubCounter:componentWillUnmount 组件将要销毁")
  }
}
ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);










/*

1:Counter constructor:构造函数
index.js:21 2:Counter componentWillMmount:组件将要挂载
index.js:24 3:Counter render:生成虚拟DOM
index.js:33 4:Counter componentDidMount:组件挂载完成
2index.js:36 5:Counter shouleComponentUpdate，询问用户组件是否要更新
index.js:40 6:Counter componentWillUpdate:组件将要更新
index.js:24 3:Counter render:生成虚拟DOM
index.js:43 7:Counter componentDidUpdate:组件更新完成


*/
