<template>
  <SwaggerUI />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwaggerUI from "@/views/SwaggerUI.vue";

import setMeta from "@/utils/setMeta";

@Component({
  components: {
    SwaggerUI,
  },
})
export default class HomeView extends Vue {
  mounted() {
    setMeta({ title: "Home", description: "Make Imagination True." });
  }
}
</script>
