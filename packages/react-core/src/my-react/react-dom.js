

// 将element渲染到container中
function render(element, container) {
  // 如果是字符串，说明是一个普通文本
  if (typeof element === "string" || typeof element === "number") {
    let dom = document.createTextNode(element);
    return container.appendChild(dom);
  }
  // 如果不是文本节点
  let type = element.type;
  let props = element.props;
  let isReactComponent = type.isReactComponent;
  let componentInstance;
  if (isReactComponent) {
    componentInstance = new type(props);
    element = componentInstance.render();
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  } else if (typeof type === "function") {
    element = type(props);   // 函数组件执行后悔返回一个react元素
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  }
  let dom = createDom(type, props);
  if (isReactComponent && componentInstance) {
    // 将类组件的实例的dom指向这个类组件创建出来的真实DOM。
    componentInstance.dom = dom;
  }
  container.appendChild(dom)
}

function createDom(type, props) {
  let dom = document.createElement(type);
  for (let propName in props) {   // 循环每一个属性
    if (propName === "children") {
      if (Array.isArray(props.children)) {
        props.children.forEach((child) => render(child, dom))
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
      dom[propName.toLowerCase()] = props[propName];
    } else {
      dom.setAttribute(propName, props[propName])
    }
  }
  return dom;
}

// 更新组件
export function updateComponent(componentInstance) {
  let element = componentInstance.render();   // 根据新的props和state得到新的虚拟DOM。
  console.log("element:1111:", element)
  let { type, props } = element;
  let dom = createDom(type, props);   // 根据新的虚拟DOM，创建新的真实DOM。
  // 拿到之前的节点的父节点，将老的dom节点替换成新的dom节点。
  componentInstance.dom.parentNode.replaceChild(dom, componentInstance.dom)  // 将老的DOM替换成新的DOM
  componentInstance.dom = dom;
}

const ReactDOM = {
  render
}
export default ReactDOM;
