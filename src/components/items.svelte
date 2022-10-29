<script lang="ts">
  import type { DocumentNode } from "@apollo/client";
  import { onMount, onDestroy } from "svelte";
  import { interpret } from "xstate";
  import VirtualScroll from "./virtual-scroll.svelte";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import type { ParameterPrefix } from "~/lib/buildParameters";
  import { openToast } from "~/lib/ionicController";
  import { urlToParamsObject } from "~/lib/paramsToObject";
  import { musicItemsMachine } from "~/machines/music-items-machine";

  export let type: ParameterPrefix;
  export let document: DocumentNode;
  export let variables: any | undefined = undefined;
  export let loaded = false;
  let params = urlToParamsObject($page.url);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface $$Slots {
    default: {
      // slot name
      item: any;
      items: any[];
      index: number;
    };
  }

  const service = interpret(musicItemsMachine(type, document));

  onMount(() => {
    service.start();
  });

  onDestroy(() => {
    service.stop();
  });

  $: if (service) {
    if (params) {
      service.send({
        params,
        type: "SET_PARAMETERS",
      });
    } else if (variables) {
      service.send({
        type: "SET_VARIABLES",
        variables,
      });
    }

    service.send({ type: "EXECUTE_QUERY" });
  }

  let items: any[];
  $: items = $service?.context.items || [];

  let reported = false;
  $: if (
    $service &&
    $service.matches("active") &&
    !$service.context.hasNext &&
    items.length === 0 &&
    !reported
  ) {
    openToast({
      color: "light-blue",
      duration: 5000,
      message: "一致する検索結果はありませんでした",
    });

    reported = true;
  }

  // eslint-disable-next-line no-undef
  let infiniteScroll: HTMLIonInfiniteScrollElement;
  const ionInfinite = () => {
    service.send("FETCH_MORE");
  };

  $: if ($service && $service.matches("active") && infiniteScroll) {
    loaded = true;
    infiniteScroll.complete();
    if ($service.context.hasNext) {
      infiniteScroll.disabled = false;
    } else {
      infiniteScroll.disabled = true;
    }
  }

  afterNavigate((props) => {
    if (props.to?.url) {
      params = urlToParamsObject(props.to.url);
      console.log(params);
    }
  });
</script>

<VirtualScroll {items} thumbnail let:index let:item>
  <slot {index} {item} {items} />
</VirtualScroll>

<ion-infinite-scroll bind:this={infiniteScroll} threshold="100px" on:ionInfinite={ionInfinite}>
  <ion-infinite-scroll-content loading-spinner="lines" />
</ion-infinite-scroll>
