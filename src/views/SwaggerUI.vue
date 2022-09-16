<template>
  <div id="swagger-ui"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwaggerUIBundle from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

@Component
export default class SwaggerUI extends Vue {
  mounted() {
    SwaggerUIBundle({
      url: "WOOZ-API.yaml",
      dom_id: "#swagger-ui",
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    });
  }
}
</script>
