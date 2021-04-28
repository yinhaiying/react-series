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
