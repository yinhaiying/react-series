
// JSX元素是只读的，直接修改会出现报错
const element = <h1 id="title">hello</h1>
function update() {
  element.props.id = "hi";
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(update, 1000)


// 创建新的JSX元素进行更新

function update() {
  const element = <h1 id="title">hello,{Date.now()}</h1>
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(update, 1000)


// React只会部分更新

function update() {
  const element = (
    <h1 id="title">
      <p>hello</p> // 这里不会进行更新 ,{Date.now()} // 只更新这里
    </h1>
  );
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(update, 1000)
