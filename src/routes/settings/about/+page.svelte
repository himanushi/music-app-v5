<script lang="ts">
  import { onMount } from "svelte";
  import { markdown } from "~/lib/markdown";
  import { twitterAccount } from "~/lib/variable";
  // import { currentVersion, reset } from "~/lib/version";

  let html: string | HTMLElement | DocumentFragment = "";
  onMount(() => {
    const version = "";

    html = markdown(`
    # このアプリについて
    ## 概要
    音楽サブスクリプションで配信中の音楽を検索できるサービスです。
    
    ## 目的
    ユーザー同士で音楽を楽しく共有できるよう開発を進めています。
    
    ## SNS, 開発プロジェクトなど
    * [Twitter](https://twitter.com/${twitterAccount})
    * [note](https://note.com/himanushi/n/nd598a3d92a15)
    * [Github](https://github.com/users/himanushi/projects/2)
    
    ## 問い合わせ
    * [Q & A](https://note.com/himanushi/n/na2e56d4ee4d6)
    * [Twitter にてダイレクトメッセージをお願いします](https://twitter.com/${twitterAccount})
    
    #### ファイルバージョン
    ${version}
    
    #### リセット
    再生されないなどの不具合がある場合は下のボタンをクリックしてください。
    `);
  });
</script>

<div class="ion-padding">
  {@html html}
</div>

<ion-item button>
  <ion-icon name="refresh-outline" slot="start" />
  リセット
</ion-item>
