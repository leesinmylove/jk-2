<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App"

};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

.overflowPoint{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
</style>
