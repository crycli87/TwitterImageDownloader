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
var buttonElement = '<div class="ProfileTweet-action Dl-Image"><input type="button" value="画像をDL" style="width: 70px;"></div>"';

(function main() {
unsafeWindow.onload = run();
var mutationObserver = new MutationObserver(function(mutationRecords){
  run();
});
var timeLine = document.querySelector("#timeline");
var tweetDetails = document.querySelector("#permalink-overlay");
if(timeLine) mutationObserver.observe(timeLine, {childList: true, subtree: true});
if(tweetDetails) mutationObserver.observe(tweetDetails, {childList: true, subtree:true});
})();

function run(){ //TODO: 関数名センスなさすぎるのでなんとかしたい
  var tweets = $(".tweet:has(.AdaptiveMedia-photoContainer):not(:has(.Dl-Image))");
  GM_log(tweets.length);
  $.each(tweets, addButton);
  var observer = new MutationObserver(function (MutationRecords, MutationObserver) {
    var tweets = $(".tweet:has(.AdaptiveMedia-photoContainer):not(:has(.Dl-Image))");
    $.each(tweets, addButton);
  });
  observer.observe($('#stream-items-id').get(0), {
    childList: true,
  });
}

function addButton(index, tweet){
  var originUrls = getOriginUrls(tweet);
  var userId = $(tweet).find(".username > b").eq(0).text();
  $(tweet).find("div.ProfileTweet-actionList").append(buttonElement);
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
  var imgs = $(tweet).find(".AdaptiveMedia-photoContainer > img");
  var imgUrls = [];
  $(imgs).each(function(i,img){
    imgUrls.push($(img).attr("src") + ":orig");
  });
  return imgUrls;
}

function getFileName(url){
  var splited = url.split("/");
  var name = splited[splited.length-1].split(":")[0];
  return name;
}
