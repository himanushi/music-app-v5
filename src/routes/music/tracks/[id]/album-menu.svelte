<script lang="ts">
  import type { Menu } from "~/components/item-divider/item-divider";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import { client } from "~/graphql/client";
  import { AlbumDocument, ChangeAlbumStatusDocument, type StatusEnum } from "~/graphql/types";
  import { errorMessages } from "~/lib/error";
  import { closeLoading, openLoading, openToast } from "~/lib/ionicController";

  export let id: string;
  export let albumStatus: StatusEnum;

  const statusItems = [
    { label: "有効",
      value: "ACTIVE" },
    { label: "有効 & ツイート",
      value: "ACTIVE" },
    { label: "保留",
      value: "PENDING" },
    { label: "除外",
      value: "IGNORE" },
  ];

  const onChangeStatus = async (option: { label: string; value: StatusEnum }) => {
    try {
      await openLoading();

      await client.mutate({
        mutation: ChangeAlbumStatusDocument,
        refetchQueries: [
          {
            query: AlbumDocument,
            variables: { id },
          },
        ],
        variables: {
          input: {
            id,
            status: option.value,
            tweet: option.label === "有効 & ツイート",
          },
        },
      });

      openToast({
        color: "main",
        duration: 5000,
        message: "ステータスを更新しました",
      });
    } catch (error: any) {
      if (error) {
        const messages = errorMessages(error);
        openToast({
          color: "light-red",
          message: `エラーが発生しました。[${messages._?.join(", ")}]`,
        });
      }
    } finally {
      await closeLoading();
    }
  };

  const menu: Menu = {
    items: [
      {
        label: "ステータス変更",
        onChange: onChangeStatus,
        options: statusItems,
        type: "select",
        value: albumStatus,
      },
    ],
    onOk: () => {
      // nothing
    },
    title: "設定",
  };
</script>

<ItemDivider {menu} title="Album" />
