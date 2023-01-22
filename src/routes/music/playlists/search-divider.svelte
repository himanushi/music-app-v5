<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Menu } from "~/components/item-divider/item-divider";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import { searchParams } from "~/lib/buildParameters";

  const url = $page.url;
  const queries = url.searchParams;

  let name: string | null | undefined = queries.get(searchParams.track.name);
  let favorite = queries.get(searchParams.track.favorite) === "1";
  const order = queries.get(searchParams.track.order) || "NEW";
  const direction = queries.get(searchParams.track.direction) || "DESC";

  let orderValue = `${order}.${direction}`;
  const orderItems = [
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

  let statusValue = queries.get(searchParams.track.status) || "ACTIVE";
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
    if (name && name.length > 1) {
      url.searchParams.set(searchParams.track.name, name);
    } else {
      url.searchParams.delete(searchParams.track.name);
    }

    if (favorite) {
      url.searchParams.set(searchParams.track.favorite, "1");
    } else {
      url.searchParams.delete(searchParams.track.favorite);
    }

    if (orderValue) {
      const [_order, _direction] = orderValue.split(".");
      url.searchParams.set(searchParams.track.order, _order);
      url.searchParams.set(searchParams.track.direction, _direction);
    } else {
      url.searchParams.delete(searchParams.track.order);
      url.searchParams.delete(searchParams.track.direction);
    }

    if (statusValue === "ACTIVE") {
      url.searchParams.delete(searchParams.track.status);
    } else {
      url.searchParams.set(searchParams.track.status, statusValue);
    }

    goto(url);
  };

  const menu: Menu = {
    items: [
      {
        label: "タイトル(2文字以上)",
        onChange: (value) => (name = value),
        type: "input",
        value: name,
      },
      {
        label: "並び順",
        onChange: (option) => (orderValue = option.value),
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
        onChange: (option) => (statusValue = option.value),
        options: statusItems,
        type: "select",
        value: statusValue,
      },
    ],
    onOk,
    title: "Search",
  };
</script>

<ItemDivider {menu} title="Tracks" />
