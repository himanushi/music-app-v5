import { readable } from "svelte/store";
import { client } from "~/graphql/client";
import { MeDocument, type MeQuery } from "~/graphql/types";

export const me = readable<MeQuery["me"]>(undefined, (set) => {
  (async () => {
    const result = await client.query({
      fetchPolicy: "cache-first",
      query: MeDocument,
    });
    set(result.data.me);
  })();

  client.
    watchQuery({
      fetchPolicy: "cache-first",
      query: MeDocument,
    }).
    subscribe((data) => set(data.data.me));
});
