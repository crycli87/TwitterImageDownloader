// ==UserScript==
// @name         twitterの画像DLするの
// @namespace    http://tampermonkey.net/
// @version      1.0b.1
// @author       crycli87
// @match        https://twitter.com/*
// @require      http://code.jquery.com/jquery-2.1.4.js
// @grant        GM_log
// ==/UserScript==

var buttonStyle = "";
var buttonElement = '<div class="css-1dbjc4n r-1mlwlqe r-18u37iz r-18kxxzh r-1h0z5md Dl-Image"><div aria-haspopup="true" aria-label="Media Download" role="button" data-focusable="true" tabindex="0" class="css-18t94o4 css-1dbjc4n r-1777fci r-11cpok1 r-1ny4l3l r-bztko3 r-lrvibr"><div dir="ltr" class="css-901oao r-1awozwy r-111h2gw r-6koalj r-1qd0xha r-a023e6 r-16dba41 r-1h0z5md r-ad9z0x r-bcqeeo r-o7ynqc r-clp7b1 r-3s2u2q r-qvutc0"><div class="css-1dbjc4n r-xoduu5"><div class="css-1dbjc4n r-1niwhzg r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div><svg viewBox="0 0 24 24" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"><g xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-180 11.999625205993652,9.00012493133545)"><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path></g><g><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g></g></svg></div></div></div></div>';

(function main() {
  const jsInitCheckTimer = setInterval(jsLoaded, 1000);
  function jsLoaded() {
    if (document.querySelector('section[role="region"]') != null) {
      clearInterval(jsInitCheckTimer);
      run();
      var mutationObserver = new MutationObserver(function(mutationRecords){
        run();
      });
      var timeLine = document.querySelector('main[role="main"]');
      mutationObserver.observe(timeLine, {childList: true, subtree: true});
    }
  }
})();

function run(){ //TODO: 関数名センスなさすぎるのでなんとかしたい
  var tweets = $("article:has(img[alt='画像']):not(:has(.Dl-Image))");
  $.each(tweets, addButton);
  var observer = new MutationObserver(function (MutationRecords, MutationObserver) {
    var tweets = $("div[data-testid='tweet']:has(img[alt='画像']):not(:has(.Dl-Image))");
    $.each(tweets, addButton);
  });
  observer.observe(document.querySelector("main"), {
    childList: true,
  });
}

function addButton(index, tweet){
  var imgs = $(tweet).find("img[alt='画像']");
  var links = $(tweet).find("a[href*='photo']"); // *= で含む場合ッテ意味らしい
  var isNotLoaded = (imgs.length!=links.length);
  if(isNotLoaded) return; // 場合によってはimgが1枚ずつ読み込まれたりしてこの関数実行されるときにまだ揃ってなかったりするのでその場合まだ処理しないでおく
  var originUrls = getOriginUrls(tweet);
  var userId = $(tweet).find("div[dir='ltr'] > span").text().replace("@","");
  $(tweet).find("div[role='group']").append(buttonElement);
  $(tweet).find(".Dl-Image").bind("click", {urls:originUrls, userId:userId}, download);
}

function download(event){
  var urls = event.data.urls;
  var userId = event.data.userId;
  urls.forEach(function(url,i,ar){
    var request = new XMLHttpRequest();
    var fileName = userId + "-" + getFileName(url);
    request.open("GET", url, true);
    request.responseType = "blob";
    request.onload = function (e) {
      var blob = request.response;
      var objectUrl = window.URL.createObjectURL(blob);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = objectUrl;
      link.download = fileName;
      link.click();
      document.body.removeChild(link);
    };
    request.send();
  });
  event.preventDefault();
  event.stopPropagation();
}

function getOriginUrls(tweet){
  var imgs = $(tweet).find("img[alt='画像']");
  GM_log(imgs.length);
  var imgUrls = [];
  $(imgs).each(function(i,img){
    var originUrl = $(img).attr("src").split("&")[0] + "&name=4096x4096";
    imgUrls.push(originUrl);
  });
  return imgUrls;
}

function getFileName(url){
  var splited = url.split("/");
  var name = splited[splited.length-1].split(":")[0];
  return name;
}
