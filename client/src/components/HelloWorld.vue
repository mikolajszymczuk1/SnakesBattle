<template>
  <h1>{{ msg }}</h1>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

const msg: Ref<string> = ref('Hello World !!!');
</script>
