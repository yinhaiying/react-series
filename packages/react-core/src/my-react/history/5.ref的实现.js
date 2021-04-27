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
