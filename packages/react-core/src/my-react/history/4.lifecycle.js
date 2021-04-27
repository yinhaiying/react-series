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
