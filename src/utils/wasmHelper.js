/**
 * @Author: longmo
 * @Date: 2025-03-12 20:51:31
 * @LastEditTime: 2025-03-12 21:36:30
 * @FilePath: src/utils/wasmHelper.js
 * @Description:
 *
 * // 使用方法
 * loadAndInstantiateWasm("/wasms/release.wasm").then((wasmInstance) => {
 *   if (wasmInstance) {
 *     // 在这里可以开始调用WASM导出的函数
 *     console.log("WASM module loaded and instantiated successfully.");
 *   }
 * });
 */

/**
 * 根据public下的路径，加载并实例化 wasm
 * @param wasmPath 以 / 开头的public下的路径
 * @param importObject 用于提供该WASM模块所需的外部依赖项
 * @returns {Promise<WebAssembly.WebAssemblyInstantiatedSource>}
 */
export async function loadAndInstantiateWasm(wasmPath, importObject = {}) {
  try {
    const response = await fetch(wasmPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 如果环境不支持 WebAssembly.instantiateStreaming，则提供一个兼容的实现
    if (!WebAssembly.instantiateStreaming) {
      WebAssembly.instantiateStreaming = async (resp, importObjectFallback) => {
        const source = await (await resp).arrayBuffer();

        WebAssembly.compile(source);
        return WebAssembly.instantiate(source, importObjectFallback);
      };
    }

    const wasmModule = await WebAssembly.instantiateStreaming(
      response,
      importObject
    ).catch((e) => {
      console.error("Error instantiating WASM module:", e);
      throw e;
    });

    // 返回整个模块对象，以便访问exports之外的属性
    return wasmModule;
  } catch (err) {
    console.error("Failed to fetch or instantiate WASM module:", err);
    // Handle errors here, perhaps retry logic or fallback behavior
    throw err; // 或者根据需要处理错误
  }
}

/**
 *  创建一个函数，用于加载并实例化wasm模块，并缓存编译后的模块
 * @param cachedModule
 * @returns {(function(*, {}=): Promise<*|WebAssembly.Instance|undefined>)|*}
 */
export function createLoadAndInstantiateWasm(cachedModule = null) {
  return async function loadAndInstantiateWasm(wasmPath, importObject = {}) {
    try {
      // 如果已经存在缓存的模块，则直接使用该模块进行实例化
      if (cachedModule) {
        const { instance } = await WebAssembly.instantiate(
          cachedModule,
          importObject
        );
        return instance;
      }

      const response = await fetch(wasmPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 如果环境不支持 WebAssembly.instantiateStreaming，则提供一个兼容的实现
      if (!WebAssembly.instantiateStreaming) {
        WebAssembly.instantiateStreaming = async (
          resp,
          importObjectFallback
        ) => {
          const source = await (await resp).arrayBuffer();
          const module = await WebAssembly.compile(source);
          cachedModule = module; // 缓存编译后的模块
          return {
            instance: await WebAssembly.instantiate(
              module,
              importObjectFallback
            ),
          };
        };
      }

      const wasmModule = await WebAssembly.instantiateStreaming(
        response,
        importObject
      ).catch((e) => {
        console.error("Error instantiating WASM module:", e);
        throw e;
      });

      // 缓存编译后的模块
      cachedModule = wasmModule.module;

      // 返回实例
      return wasmModule.instance;
    } catch (err) {
      console.error("Failed to fetch or instantiate WASM module:", err);
      throw err; // 或者根据需要处理错误
    }
  };
}
