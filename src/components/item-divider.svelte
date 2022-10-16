<script lang="ts">
  export let title: string;
  export let height = 44;
</script>

<ion-item-divider style="height: {height}px" color="dark-gray" sticky>
  <ion-note>{title}</ion-note>
</ion-item-divider>
