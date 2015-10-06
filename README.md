# fav-rss-reader-v2
MonacaのRSSリーダーのサンプルをベースに、ニフティクラウドmobile backendを使ったお気に入り機能を実装したRSSリーダー（JavaScript SDK version 2 対応）

## 使い方

### お気に入り機能付きRSSリーダー＜オフライン版＞

このリポジトリをそのままMonacaへインポートすればお試し頂けます。
端末のローカルストレージにお気に入り情報を保存するタイプです。
以下の手順に従ってインポートしてください。

1. [Download ZIP](https://github.com/ndyuya/fav-rss-reader-v2/archive/master.zip)から、zipファイルをダウンロードする
1. [Monaca](https://ja.monaca.io/)で「開発をスタート」＞「Monaca.ioで開発」＞「Import Project」からダウンロードしたzipファイルをインポートする
1. [Monacaデバッガー](http://ja.monaca.io/debugger.html)で動作確認をする

### お気に入り機能付きRSSリーダー＜オンライン版＞

オフライン版に手を加えることでオンライン版を作ることができます。
mobile backendのデータストアへお気に入り情報を保存するタイプです。
以下の手順に従ってオフライン版を改変してください。
予めオフライン版の動作確認まで完了しておく必要があります。

1. [NCMB javascript SDK v2](https://github.com/NIFTYCloud-mbaas/ncmb_js/releases)でjavascript SDKをダウンロードする
1. Monaca IDE上で、1.でダウンロードしたncmb.min.jsをwww/jsフォルダにアップロードする
1. www/index.htmlの11行目と12行目の間に以下のコードを追記する
    ```html
    <script src="js/ncmb.min.js"></script>
    ```

1. www/index.htmlの13行目にある`<script src="favorite-offline.js"></script>`を以下のように変更する
    ```html
    <script src="js/favorite-online.js"></script>
    ```

1. [mobile backendのダッシュボード](https://console.mb.cloud.nifty.com/)で新しいアプリを作成する
1. 作成したアプリのアプリケーションキーをコピーして、Monaca IDE上のwww/index.htmlの22行目にある「YOUR_NCMB_APPLICATION_KEY」を置き換える
1. 作成したアプリのクライアントキーをコピーして、Monaca IDE上のwww/index.htmlの23行目にある「YOUR_NCMB_CLIENT_KEY」を置き換える
1. www/js/favorite-online.jsの`(1) SDKの初期化処理を記述するところ`の部分に以下のコードを記載する
    ```javascript
    this.ncmb = new NCMB(options.applicationKey, options.clientKey);
    ```

1. www/js/favorite-online.jsの`(2) 保存先クラスを定義するところ`の部分に以下のコードを記載する
    ```javascript
    this.FavoriteClass = this.ncmb.DataStore("favorite");
    ```

1. www/js/favorite-online.jsの`(3) 保存するオブジェクトを生成するところ`の部分に以下のコードを記載する
    ```javascript
    var favorite = new this.FavoriteClass();
    ```

1. www/js/favorite-online.jsの`(4) 保存したい値をセットし、保存するところ`の部分に以下のコードを記載する
    ```javascript
    favorite.set("uuid", self.uuid)
            .set("url", url)
            .save()
            .then(function(favorite){
                self.apply(item);
            })
            .catch(function(error){
                self.apply(item);
            });
    ```

1. www/js/favorite-online.jsの`(5) uuidとurlの両方が合致するオブジェクトを検索し、見つけたものを削除するところ`の部分に以下のコードを記載する
    ```javascript
    this.FavoriteClass.equalTo("uuid", self.uuid)
                      .equalTo("url", url)
                      .fetch()
                      .then(function(favorite){
                          favorite.delete()
                                  .then(function(result){
                                      self.apply(item);
                                  })
                                  .catch(function(error){
                                      self.apply(item);
                                  });
                      })
                      .catch(function(error){
                          self.apply(item);
                      });
    ```

1. www/js/favorite-online.jsの`(6) urlだけが合致するオブジェクトの数を取得し、星の横に表示するところ`の部分に以下のコードを記載する
    ```javascript
    this.FavoriteClass.equalTo("url", url)
                      .count()
                      .fetchAll()
                      .then(function(results){
                          if (results.count > 0) {
                              icon.text(results.count);
                          } else {
                              icon.text("0");
                          }
                      })
                      .catch(function(error){
                          console.log(error.message);
                          icon.text("0");
                      });
    ```

1. www/js/favorite-online.jsの`(7) urlとuuidの両方が合致するオブジェクトの数を取得し、星の色を変更するところ`の部分に以下のコードを記載する
    ```javascript
    this.FavoriteClass.equalTo("uuid", self.uuid)
                      .equalTo("url", url)
                      .count()
                      .fetchAll()
                      .then(function(results){
                          if (results.count > 0) {
                              icon.addClass('fa-star');
                              icon.removeClass('fa-star-o');
                          } else {
                              icon.removeClass('fa-star');
                              icon.addClass('fa-star-o');
                          }
                      })
                      .catch(function(error){
                          console.log('own favorite check error: ' + error.message);
                      });
    ```

1. [Monacaデバッガー](http://ja.monaca.io/debugger.html)で動作確認をする

## See

* Monaca
  * https://ja.monaca.io/
* ニフティクラウドmobile backend
  * http://mb.cloud.nifty.com/
* MonacaのRSSリーダーのサンプル
  * https://github.com/monaca/project-templates/tree/master/2-rss
  * http://docs.monaca.mobi/cur/ja/sampleapp/samples/sample_rss_reader/

