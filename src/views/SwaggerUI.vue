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
    const _urls = [
      {
        url: "https://petstore.swagger.io/api/swagger.json",
        name: "TEST",
      },
    ];
    const _url = "https://petstore.swagger.io/v2/swagger.json";
    SwaggerUIBundle({
      url: _url,
      dom_id: "#swagger-ui",
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    });
  }
}
</script>
