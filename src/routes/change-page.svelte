<script lang="ts">
  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import { scrollElement } from "~/store/scroll-element";
  import { scrollLock } from "~/store/scroll-lock";

  beforeNavigate((props) => {
    if ($scrollElement && props.from?.url.href) {
      scrollLock.update(props.from?.url.href, $scrollElement.scrollTop);
    }
  });

  afterNavigate((props) => {
    setTimeout(() => {
      if ($scrollElement && props.to?.url.href) {
        $scrollElement.scrollTop = $scrollLock[props.to.url.href] || 0;
      }
    }, 0);
  });
</script>
