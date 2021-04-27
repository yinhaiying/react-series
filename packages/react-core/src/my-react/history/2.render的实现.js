

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
  if (isReactComponent) {
    let componentInstance = new type(props);
    element = componentInstance.render();
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  } else if (typeof type === "function") {
    element = type(props);   // 函数组件执行后悔返回一个react元素
    type = element.type;     // 重新得到react元素的类型
    props = element.props;   // 重新得到react元素的属性
  }
  let dom = createDom(type, props);
  container.appendChild(dom)
}

function createDom(type, props) {
  let dom = document.createElement(type);
  for (let propName in props) {   // 循环每一个属性
    if (propName === "children") {
      props.children.forEach((child) => render(child, dom))
    } else if (propName === "className") {
      dom.className = props[propName]
    } else if (propName === "style") {
      let styleObj = props[propName];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else {
      dom.setAttribute(propName, props[propName])
    }
  }
  return dom;
}

export default {
  render
}
