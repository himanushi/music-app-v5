<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Menu } from "~/components/item-divider/item-divider";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import { searchParams } from "~/lib/buildParameters";

  export let refresh: () => void;

  const url = $page.url;
  const queries = url.searchParams;

  let name: string | null | undefined = queries.get(searchParams.album.name);
  let favorite = queries.get(searchParams.album.favorite) === "1";
  const order = queries.get(searchParams.album.order) || "RELEASE";
  const direction = queries.get(searchParams.album.direction) || "DESC";

  let orderValue = `${order}.${direction}`;
  const orderItems = [
    {
      label: "発売日新しい順",
      value: "RELEASE.DESC",
    },
    {
      label: "発売日古い順",
      value: "RELEASE.ASC",
    },
    {
      label: "追加日新しい順",
      value: "NEW.DESC",
    },
    {
      label: "追加日古い順",
      value: "NEW.ASC",
    },
    {
      label: "人気順",
      value: "POPULARITY.DESC",
    },
  ];

  let statusValue = queries.get(searchParams.album.status) || "ACTIVE";
  const statusItems = [
    {
      label: "有効",
      value: "ACTIVE",
    },
    {
      label: "保留",
      value: "PENDING",
    },
    {
      label: "除外",
      value: "IGNORE",
    },
  ];

  const onOk = () => {
    if (name) {
      url.searchParams.set(searchParams.album.name, name);
    } else {
      url.searchParams.delete(searchParams.album.name);
    }

    if (favorite) {
      url.searchParams.set(searchParams.album.favorite, "1");
    } else {
      url.searchParams.delete(searchParams.album.favorite);
    }

    if (orderValue) {
      const [_order, _direction] = orderValue.split(".");
      url.searchParams.set(searchParams.album.order, _order);
      url.searchParams.set(searchParams.album.direction, _direction);
    } else {
      url.searchParams.delete(searchParams.album.order);
      url.searchParams.delete(searchParams.album.direction);
    }

    if (statusValue === "ACTIVE") {
      url.searchParams.delete(searchParams.album.status);
    } else {
      url.searchParams.set(searchParams.album.status, statusValue);
    }

    goto(url);
    refresh();
  };

  const menu: Menu = {
    items: [
      {
        label: "タイトル",
        onChange: (value) => (name = value),
        type: "input",
        value: name,
      },
      {
        label: "並び順",
        onChange: (value) => (orderValue = value),
        options: orderItems,
        type: "select",
        value: orderValue,
      },
      {
        checked: favorite,
        label: "お気に入り",
        onChange: (checked) => (favorite = checked),
        type: "checkbox",
      },
      {
        label: "ステータス",
        onChange: (value) => (statusValue = value),
        options: statusItems,
        type: "select",
        value: statusValue,
      },
    ],
    onOk,
    title: "Search",
  };
</script>

<ItemDivider {menu} title="Artists" />
