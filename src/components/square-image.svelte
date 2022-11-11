<script lang="ts">
  export let src: string | undefined = "/assets/no-image.png";
  export let alt: string | undefined = src;
</script>

<ion-img {alt} {src} />

<style lang="scss">
  ion-img {
    aspect-ratio: auto 1 / 1;
    height: 100%;
    width: 100%;
    max-width: 500px;
  }
</style>
