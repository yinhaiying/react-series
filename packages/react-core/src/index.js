import React from 'react';  // React核心库 提供react组件等
import ReactDOM from 'react-dom';  // DOM渲染库
// import React from './my-react/react';  // React核心库 提供react组件等
// import ReactDOM from './my-react/react-dom';  // DOM渲染库


// let ThemeContext = React.createContext();  // ThemeContext = {Provider,Consumer}

function createContext() {
  function Provider(props) {
    Provider.value = props.value;
    return props.children;  // 直接渲染儿子，只是用于缓存value
  }
  function Consumer(props) {
    return props.children(Provider.value)
  }
  return {
    Provider,
    Consumer
  }
}
let ThemeContext = createContext()
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
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => {
            return (
              <div style={{ margin: "10px", padding: "5px", border: `5px solid ${value.color}` }}>
                main
                <Content />
                <Context2 />
              </div>
            )
          }
        }
      </ThemeContext.Consumer>

    )
  }
}

class Content extends React.Component {
  render() {
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
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => {
            return (
              <div style={{ margin: "10px", padding: "5px", border: `5px solid ${value.color}` }}>
                header
                <Title />
              </div>
            )
          }
        }
      </ThemeContext.Consumer>
    )
  }
}
class Title extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => {
            return (
              <div style={{ margin: "10px", padding: "5px", border: `5px solid ${value.color}` }}>title</div>
            )
          }
        }
      </ThemeContext.Consumer>

    )
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);



