<script lang="ts">
  export let name: string;
  name = name.replaceAll(/\s/giu, "+");
</script>

<ion-item button href={`https://music.line.me/webapp/search/tracks?query=${name}`} target="_blank">
  <ion-icon slot="start" src="/assets/logo-line.svg" />
  <ion-label> Line Music で検索 </ion-label>
</ion-item>
