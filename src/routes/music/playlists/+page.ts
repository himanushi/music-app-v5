import { client } from "~/graphql/client";

export const clearCache = () => {
  client.cache.evict({
    fieldName: "tracks",
    id: "ROOT_QUERY",
  });
};
