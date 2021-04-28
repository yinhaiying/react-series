import { updateComponent } from "./react-dom.js";

export function createElement(type, config = {}, ...children) {
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
    this.updateQueue = [];  // 存放临时的更新队列
    this.isBatchUpdate = false;  // 当前是否处于批量更新模式
    this.callbacks = [];   // 收集setState的所有回调函数
    this.refs = {};
  }
  setState(partialState, callback) {
    this.updateQueue.push(partialState);
    callback && this.callbacks.push(callback);
    if (!this.isBatchUpdate) {  // 如果当前不是处于批量更新模式，则直接更新
      this.forceUpdate();
    }
  }
  forceUpdate() {
    if (this.updateQueue.length === 0) return;
    this.state = this.updateQueue.reduce((accumulate, current) => {
      let nextState = typeof current === "function" ? current(accumulate) : current;
      accumulate = { ...accumulate, ...nextState };
      return accumulate;
    }, this.state);
    this.updateQueue.length = 0;
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
    // 修改状态后，更新组件
    // shouldComponentUpdate返回false不更新组件
    if (this.shouldComponentUpdate && !this.shouldComponentUpdate(this.props, this.state)) {
      return;
    }
    // 将要更新
    if (this.UNSAFE_componentWillUpdate) {
      this.UNSAFE_componentWillUpdate();
    }
    // 更新组件
    updateComponent(this);
    // 更新完成
    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }

  }
}


// ref的实现
function createRef() {
  return {
    current: null
  }
}

// Context的实现
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


const React = {
  createElement,
  Component,
  createRef,
  createContext
}

export default React
