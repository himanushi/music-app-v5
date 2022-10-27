<script lang="ts">
  export let src: string | undefined = "/assets/no-image.png";
  export let alt: string | undefined = src;

  let loaded = false;
  const onLoaded = () => (loaded = true);
</script>

<ion-img style={loaded ? "" : "width:0px;height:0px;"} {alt} {src} on:ionImgDidLoad={onLoaded} />
<ion-img style={loaded ? "display:none;" : ""} alt="no image" src="/assets/no-image.png" />

<style lang="scss">
  ion-img {
    max-width: 500px;
  }
</style>
