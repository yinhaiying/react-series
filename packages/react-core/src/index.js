import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


let ThemeContext = React.createContext();  // ThemeContext = {Provider,Consumer}
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red"
    }
  }
  changeColor = (color) => {
    this.setState({ color })
  }
  render() {
    let value = { color: this.state.color, changeColor: this.changeColor };
    return (
      <ThemeContext.Provider value={value}>
        <div style={{ width: "200px", margin: "10px", padding: "5px", border: `5px solid ${this.state.color}` }}>
          Page
        <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    )
  }
}
class Main extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ margin: "10px", padding: "5px", border: `5px solid ${this.context.color}` }}>
        main
        <Content />
        <Context2 />
      </div>
    )
  }
}

class Content extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ margin: "10px", padding: "5px", border: `5px solid ${this.context.color}` }}>
        content
        <button onClick={() => { this.context.changeColor("red") }}>红</button>
        <button onClick={() => { this.context.changeColor("green") }}>绿</button>
      </div>
    )
  }
}

function Context2(props) {
  return (
    <ThemeContext.Consumer>
      {
        (value) => {
          return (
            <div style={{ margin: "10px", padding: "5px", border: `5px solid ${value.color}` }}>
              content
              <button onClick={() => { value.changeColor("red") }}>红</button>
              <button onClick={() => { value.changeColor("green") }}>绿</button>
            </div>
          )
        }
      }
    </ThemeContext.Consumer>
  )
}

class Header extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ margin: "10px", padding: "5px", border: `5px solid ${this.context.color}` }}>
        header
        <Title />
      </div>
    )
  }
}
class Title extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ margin: "10px", padding: "5px", border: `5px solid ${this.context.color}` }}>title</div>
    )
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);



