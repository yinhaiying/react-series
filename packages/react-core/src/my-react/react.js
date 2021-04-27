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
    // 修改状态后，更新组件
    updateComponent(this);
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
  }
}

function createRef() {
  return {
    current: null
  }
}


const React = {
  createElement,
  Component,
  createRef
}

export default React
