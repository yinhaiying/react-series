

// 将element渲染到container中
function render(element, container, componentInstance) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let type = element.type;
  let props = element.props;
  let isReactComponent = type.isReactComponent;
  if (isReactComponent) {
    componentInstance = new type(props);
    if (props.ref) {
      props.ref.current = componentInstance;
    }
    element = componentInstance.render();

    // 添加componentWillMount钩子函数的处理
    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount();
    }
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  } else if (typeof type === "function") {
    element = type(props);   // 函数组件执行后悔返回一个react元素
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  }
  let dom = createDom(type, props, componentInstance);
  if (isReactComponent && componentInstance) {
    // 将类组件的实例的dom指向这个类组件创建出来的真实DOM。
    componentInstance.dom = dom;
  }
  container.appendChild(dom);
  // 添加componentDidMount钩子
  if (isReactComponent && componentInstance && componentInstance.componentDidMount) {
    componentInstance.componentDidMount();
  }

}



/*
合成事件：
在事件处理函数执行前，要把批量更新模式设置为 true。
这样的话在函数执行过程中，就不会直接更新状态和页面了，只会缓存局部状态到 updateQueue 里面。
等事件处理函数结束后，才会实际进行更新。
事件委托：把所有的事件监听都委托给document了。
*/
function addEvent(dom, eventType, listener, componentInstance) {
  eventType = eventType.toLowerCase();  // onClick => onclick
  dom.eventStore = dom.eventStore ? dom.eventStore : {};
  dom.eventStore[eventType] = { listener, componentInstance };  // dom.eventStore.onclick = {}
  // 把事件委托给document
  document.addEventListener(eventType.slice(2), dispatchEvent, false)
}

function dispatchEvent(event) {  // event原生DOM事件

  let { type, target } = event;
  while (target) {
    let { eventStore } = target;
    if (eventStore) {
      let { listener, componentInstance } = eventStore["on" + type];   // onclick
      if (listener) {
        if (componentInstance) {
          componentInstance.isBatchUpdate = true;
        }
        listener.call(null, event);
        if (componentInstance) {
          componentInstance.isBatchUpdate = false;
          componentInstance.forceUpdate();
        }
      }
    }
    target = target.parentNode;
  }
}



function createDom(type, props, componentInstance) {
  let dom = document.createElement(type);
  for (let propName in props) {   // 循环每一个属性
    if (propName === "children") {
      if (Array.isArray(props.children)) {
        props.children.forEach((child) => render(child, dom, componentInstance))
      } else {
        render(props.children, dom)
      }

    } else if (propName === "className") {
      dom.className = props[propName]
    } else if (propName === "style") {
      let styleObj = props[propName];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (propName.startsWith("on")) {
      // dom[propName.toLowerCase()] = props[propName];
      // dom：绑定的真实DOM元素， propName:onclick listener:handleClick
      addEvent(dom, propName, props[propName], componentInstance)
    } else {
      dom.setAttribute(propName, props[propName])
    }
  }
  // 处理ref
  if (props.ref) {
    if (typeof props.ref === "string") {
      componentInstance.refs[props.ref] = dom;
    } else if (typeof props.ref === "function") {
      props.ref.call(componentInstance, dom)
    } else if (typeof props.ref === "object") {
      props.ref.current = dom;
    }
  }



  return dom;
}

// 更新组件
export function updateComponent(componentInstance) {
  let element = componentInstance.render();   // 根据新的props和state得到新的虚拟DOM。
  console.log("element:1111:", element)
  let { type, props } = element;
  let dom = createDom(type, props, componentInstance);   // 根据新的虚拟DOM，创建新的真实DOM。
  // 拿到之前的节点的父节点，将老的dom节点替换成新的dom节点。
  componentInstance.dom.parentNode.replaceChild(dom, componentInstance.dom)  // 将老的DOM替换成新的DOM
  componentInstance.dom = dom;
}







const ReactDOM = {
  render
}
export default ReactDOM;
