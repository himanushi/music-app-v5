import type { PageLoad } from "./$types";
import type { Menu } from "~/components/item-divider/item-divider";
import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

export const load: PageLoad = () => {
  let order: keyof MusicKit.LibraryAlbums["attributes"] = "name";
  let direction: "asc" | "desc" = "asc";

  const onOk = () => {
    libraryAlbumsService.send({
      direction,
      order,
      type: "SORT",
    });
  };

  const menu: Menu = {
    items: [
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
