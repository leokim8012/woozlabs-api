import { Vue, Component } from "vue-property-decorator";
// import { RawLocation } from "vue-router";

@Component
export default class RouterPush extends Vue {
  public routerPush(location: string, params?: string) {
    if (!location) {
      alert("준비중입니다.");
      return;
    }

    if (params) {
      if (location.includes("/")) {
        this.$router
          .push(`${location}/${params}`)
          .then(() => window.scrollTo(0, 0))
          .catch(() => {
            return;
          });
      } else {
        this.$router
          .push({ name: location, params: { id: params } })
          .then(() => window.scrollTo(0, 0))
          .catch(() => {
            return;
          });
      }
    } else {
      if (location.includes("/")) {
        this.$router
          .push(`${location}`)
          .then(() => window.scrollTo(0, 0))
          .catch(() => {
            return;
          });
      } else {
        this.$router
          .push({ name: location })
          .then(() => window.scrollTo(0, 0))
          .catch(() => {
            return;
          });
      }
    }
  }
}
