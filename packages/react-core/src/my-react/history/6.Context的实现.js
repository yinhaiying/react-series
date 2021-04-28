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
