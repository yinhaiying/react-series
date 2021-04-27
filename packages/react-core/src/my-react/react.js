function createElement(type, config = {}, ...children) {
  let props = { ...config, children }
  return {
    type,
    props
  }
}


/*
js中并没有类的概念，类编译之后也是一个函数，为了区分函数组件和类组件，使用静态属性isReactComponent


*/
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
  setState(partilState) {

  }
}


export default {
  createElement,
  Component
}
