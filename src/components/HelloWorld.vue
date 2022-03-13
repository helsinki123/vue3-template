<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
<div>
  <el-button>按钮</el-button>
</div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
