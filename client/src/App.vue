<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { socket } from '@/utils/socketClient/socket';

const gameStore = useGameStore();
const connectionStore = useConnectionStore();

socket.off();

onBeforeMount((): void => {
  gameStore.bindEvents();
  connectionStore.bindEvents();
});
</script>
