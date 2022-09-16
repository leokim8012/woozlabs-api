<template>
  <div>
    <div>There is no page. you are looking for.</div>
    <div>
      Invalid access or the requested page could not be found. Please double
      check that the address on the page you entered is correct.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import RouterPush from "@/mixins/routerPush";
@Component({
  components: {},
})
export default class NotFound extends Mixins(RouterPush) {}
</script>

<style scoped></style>
