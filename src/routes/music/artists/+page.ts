import { client } from "~/graphql/client";

export const clearCache = () => {
  client.cache.evict({
    fieldName: "artists",
    id: "ROOT_QUERY",
  });
};
