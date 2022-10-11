<ion-grid class="ion-no-padding">
  <ion-row class="ion-justify-content-center">
    <ion-col class="ion-no-padding">
      <slot />
    </ion-col>
  </ion-row>
</ion-grid>

<style lang="scss">
  ion-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
