import { client } from "~/graphql/client";

export const clearCache = () => {
  client.cache.evict({
    fieldName: "albums",
    id: "ROOT_QUERY",
  });
};
