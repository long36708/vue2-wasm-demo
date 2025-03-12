<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <span>{{ result }}</span>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      wasmInstance: null,
      result: "",
    };
  },
  mounted() {
    // this.loadWasm().catch(console.error);
    this.runWasmFunction();
  },
  methods: {
    /**
     * 初始化或预加载WASM模块
     * @returns {Promise<void>}
     */
    async loadWasm() {
      // const wasm = await import("./realse.wasm");
      const response = await fetch("/wasms/release.wasm");
      const wasmModule = await WebAssembly.instantiateStreaming(response);
      // this.wasmInstance = wasmModule.instance;
      return wasmModule.instance;
    },
    async runWasmFunction() {
      const instance = await this.loadWasm();
      const resultFromWasm = instance.exports.add(1, 3); // 假设someFunction是WASM模块导出的函数
      this.result = `Result from Wasm: ${resultFromWasm}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
