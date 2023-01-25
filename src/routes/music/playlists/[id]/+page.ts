import type { PageLoad } from "./$types";
import { client } from "~/graphql/client";
import { PlaylistDocument, type PlaylistObject, type TrackObject } from "~/graphql/types";

export const load: PageLoad = ({ params }) => {
  const getItems = async ({
    id,
    callback,
  }: {
    id: string;
    callback: ({ playlist, tracks }: { playlist?: PlaylistObject; tracks: TrackObject[] }) => void;
  }) => {
    const playlist = (
      await client.query({
        fetchPolicy: "cache-first",
        query: PlaylistDocument,
        variables: { id },
      })
    ).data.playlist as PlaylistObject;

    const tracks = playlist.items.map((track) => track.track);

    callback({
      playlist,
      tracks,
    });
  };

  return {
    getItems,
    id: params.id,
  };
};
