import { client } from "~/graphql/client";

export const clearCache = () => {
  client.cache.evict({
    fieldName: "playlists",
    id: "ROOT_QUERY",
  });
};
