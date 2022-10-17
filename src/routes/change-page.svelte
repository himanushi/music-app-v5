<script lang="ts">
  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import { scrollElement } from "~/store/scroll-element";
  import { scrollLock } from "~/store/scroll-lock";

  beforeNavigate((props) => {
    if ($scrollElement && props.from?.url.pathname) {
      scrollLock.update(props.from.url.pathname, $scrollElement.scrollTop);
    }
  });

  afterNavigate((props) => {
    setTimeout(() => {
      if ($scrollElement && props.to?.url.pathname) {
        $scrollElement.scrollTop = $scrollLock[props.to.url.pathname] || 0;
      }
    }, 0);
  });
</script>
