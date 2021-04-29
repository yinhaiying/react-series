import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


const fromLocalStorage = (OldComponent, fieldName) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: "" }
    }
    componentDidMount() {
      let value = localStorage.getItem(fieldName);
      this.setState({ value })
    }
    handleChange = (ev) => {
      this.setState({ value: ev.target.value });
      localStorage.setItem(fieldName, ev.target.value)
    }
    render() {
      return (
        <OldComponent value={this.state.value} />
      )
    }
  }
}

const fromAjax = (OldComponent) => {
  return class extends React.Component {
    state = { value: "" };
    componentDidMount() {
      fetch("/dic.json").then((res) => res.json()).then((data) => {
        let value = data[this.props.value];  // value = "张"
        this.setState({ value })
      })
    }
    render() {
      return (
        <OldComponent value={this.state.value} />
      )
    }
  }
}


class Field extends React.Component {
  render() {
    return (
      <input defaultValue={this.props.value} />
    )
  }
}

const AjaxUserName = fromAjax(Field)

const LocalUserName = fromLocalStorage(AjaxUserName, "username");

let element = <>
  <LocalUserName />,
</>

ReactDOM.render(
  element,
  document.getElementById('root')
);



