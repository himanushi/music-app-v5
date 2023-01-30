<script lang="ts">
  export let name: string;
  name = name.replaceAll(/\s/giu, "+");
</script>

<ion-item button href={`https://music.youtube.com/search?q=${name}`} target="_blank">
  <ion-icon slot="start" src="/assets/logo-youtube.svg" />
  <ion-label> Youtube Music で検索 </ion-label>
</ion-item>
