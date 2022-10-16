<script lang="ts">
  export let src: string | undefined = undefined;
  export let alt: string | undefined = src;

  $: if (!src) {
    src = "/assets/no-image.png";
  }
</script>

<ion-img {alt} {src} />

<style lang="scss">
  ion-img {
    max-width: 500px;
  }
</style>
