<script lang="ts">
  import { appleAffiliateToken } from "~/lib/variable";

  export let id: string;

  let token = "";
  if (appleAffiliateToken) {
    token = `&at=${appleAffiliateToken}`;
  }
</script>

<ion-item button href={`https://music.apple.com/jp/album/${id}?app=music${token}`} target="_blank">
  <ion-icon slot="start" src="/assets/logo-apple-music.svg" />
  <ion-label> Apple Music で聴く </ion-label>
</ion-item>
