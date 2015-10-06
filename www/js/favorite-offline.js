/**
 * Favorite Class (Offline)
 */

var Favorite = (function() {
    var Favorite = function(options) {
        // 記事リストを指定するためのID
        this.listEl = "#feed-list";
        
        // お気に入りのOn/Offイベントの有効フラグ
        this.clickEnabled = true;

        // アプリ＋端末を特定するためのuuidを取得
        this.uuid = getUuid();
        
        // 星をタップした際のイベントを扱うハンドラを追加
        this.addClickHandler();
        
        if (options) {
          $.extend(this, options);
        }
        
    };
    
    // お気に入りの追加
    Favorite.prototype.add = function(item) {
        var self = this;
        var url = item.data('link');

        // 追加処理
        localStorage.setItem(url, '1');
        self.apply(item);
    };
    
    // お気に入りの削除
    Favorite.prototype.remove = function(item) {
        var self = this;
        var url = item.data('link');
        
	      // 削除処理
        localStorage.removeItem(url);
        self.apply(item);
    };
    
    // お気に入りの状況を画面に反映させる
    Favorite.prototype.apply = function(item) {
        var self = this;
        var url = item.data('link');
        var icon = item.children('i');
        
	      // 画面への反映処理
        if (localStorage.getItem(url) != null) {
            icon.addClass('fa-star');
            icon.removeClass('fa-star-o');
        } else {
            icon.removeClass('fa-star');
            icon.addClass('fa-star-o');
        }
    };
    
    
    // --------------------- Common Methods -----------------------
    
    // 全ての記事に対してお気に入り状況を反映させる
    Favorite.prototype.applyAll = function() {
        var self = this;
        $(this.listEl).children('li').each(function(index) {
            var item = $(this);
            self.apply(item);
        });
    };
    
    // お気に入りのOn/Offイベント時の処理
    Favorite.prototype.addClickHandler = function() {
        var self = this;
        
        $(this.listEl).on('click', '.star', function(event) {
            if (self.clickEnabled == true) {
                self.clickEnabled = false;
                setTimeout(function(){ self.clickEnabled = true; }, 1000);
                
                if ($(this).hasClass('fa-star-o')) {
                    self.add($(this).closest('li'));
                } else {
                    self.remove($(this).closest('li'));
                }
            }
            
            event.stopPropagation();
        });
    };
    
    // アプリ+端末を特定するためのuuidを取得
    // uuidはアプリアンインストールで削除されます
    var getUuid = function() {
        var uuid = localStorage.getItem('uuid');
        if (uuid === null) {
          // uuid未生成の場合は新規に作る
          var S4 = function(){
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
          };
          uuid = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
          localStorage.setItem('uuid', uuid);
        }
        
        return uuid;
    };
    
    return Favorite;
})();
