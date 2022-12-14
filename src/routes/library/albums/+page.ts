import type { PageLoad } from "./$types";
import type { Menu } from "~/components/item-divider/item-divider";
import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

export const load: PageLoad = () => {
  let order: keyof MusicKit.LibraryAlbums["attributes"] = "name";
  let direction: "asc" | "desc" = "asc";
  let name: string | null | undefined = "";
  let favorite = false;

  libraryAlbumsService.subscribe((service) => {
    name = service.context.filterName;
    if (service.context.filterOrder) {
      order = service.context.filterOrder;
    }
    if (service.context.filterDirection) {
      direction = service.context.filterDirection;
    }
  });

  const onOk = () => {
    libraryAlbumsService.send({
      direction,
      favorite,
      name,
      order,
      type: "FILTER",
    });
  };

  const menu: Menu = {
    items: [
      {
        label: "名前検索",
        onChange: (value) => (name = value),
        type: "input",
        value: name,
      },
      {
        checked: favorite,
        label: "お気に入り",
        onChange: (value) => (favorite = value),
        type: "checkbox",
      },
      {
        label: "並び順",
        onChange: (value) => {
          const [ord, dir] = value.value.split(".");
          order = ord;
          direction = dir;
        },
        options: [
          {
            label: "名前昇順",
            value: "name.asc",
          },
          {
            label: "名前降順",
            value: "name.desc",
          },
          {
            label: "アーティスト名昇順",
            value: "artistName.asc",
          },
          {
            label: "アーティスト名降順",
            value: "artistName.desc",
          },
          {
            label: "追加日昇順",
            value: "dateAdded.asc",
          },
          {
            label: "追加日降順",
            value: "dateAdded.desc",
          },
          {
            label: "配信日昇順",
            value: "releaseDate.asc",
          },
          {
            label: "配信日降順",
            value: "releaseDate.desc",
          },
          {
            label: "トラック数昇順",
            value: "trackCount.asc",
          },
          {
            label: "トラック数降順",
            value: "trackCount.desc",
          },
        ],
        type: "select",
        value: `${order}.${direction}`,
      },
    ],
    onOk,
    title: "フィルター",
  };

  return {
    menu,
  };
};
