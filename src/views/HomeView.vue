<template>
  <SwaggerUI />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwaggerUI from "@/views/SwaggerUI.vue";

@Component({
  components: {
    SwaggerUI,
  },
})
export default class HomeView extends Vue {}
</script>
