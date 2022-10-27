import {
  modalController,
  popoverController,
  toastController,
  alertController,
  loadingController,
} from "@ionic/core";
import type { Components, ModalOptions } from "@ionic/core";
import type { AlertOptions, ToastOptions } from "@ionic/core";

export const openMenu = (name: string) => async (event: any) => {
  const popover = await popoverController.create({
    component: name,
    event,
  });
  await popover.present();
};

export const closeMenu = async () => {
  await popoverController.dismiss();
};

export const isOpenModal = () => Boolean(document.querySelector("ion-modal"));

export const openModal = async (props: ModalOptions<any>) => {
  const modal = await modalController.create(props);
  await modal.present();
};

export const closeModal = async () => {
  if (isOpenModal()) {
    await modalController.dismiss();
  }
};

export const closeSidebar = () => {
  const sidebar = document.querySelector<Components.IonMenu & Element>("#sidebar");
  if (sidebar) {
    sidebar.close();
  }
};

export const openToast = async (props: ToastOptions) => {
  const defaultProps: ToastOptions = {
    buttons: [
      {
        handler: () => true,
        text: "OK",
      },
    ],
    position: "bottom",
  };

  const toast = await toastController.create({
    ...defaultProps,
    ...props,
  });
  await toast.present();
};

export const openConfirm = async (props: AlertOptions) => {
  const alert = await alertController.create(props);
  await alert.present();
};

export const openLoading = async () => {
  const loading = await loadingController.create({ message: "Loading..." });
  await loading.present();
};

export const closeLoading = async () => {
  const loading = await loadingController.getTop();
  if (loading) {
    await loading.dismiss();
  }
};
