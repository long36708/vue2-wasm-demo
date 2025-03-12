# vue2-wasm-demo

## assemblyscript

https://www.assemblyscript.org/introduction.html

需要在package.json中指定 type: "module"

## createLoadAndInstantiateWasm

```js
// 使用示例：
const loadAndInstantiateWasm = createLoadAndInstantiateWasm();

// 在其他地方也可以创建独立的实例
const anotherLoadAndInstantiateWasm = createLoadAndInstantiateWasm();

// 调用函数
loadAndInstantiateWasm('/path/to/your/module.wasm').then(instance => {
  console.log('WASM instance created successfully:', instance);
});

anotherLoadAndInstantiateWasm('/path/to/another/module.wasm').then(instance => {
  console.log('Another WASM instance created successfully:', instance);
});
```
