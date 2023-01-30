<script lang="ts">
  export let name: string;
</script>

<ion-item button href={`https://amazon.co.jp/s?i=digital-music&k=${name}`} target="_blank">
  <ion-icon slot="start" color="blue" src="/assets/logo-amazon-music.svg" />
  <ion-label> Amazon Music で検索 </ion-label>
</ion-item>
