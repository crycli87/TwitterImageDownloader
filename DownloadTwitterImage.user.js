// TODO:複数ファイル対応. 多分aタグのdownloadではダメなのでonClickでやる.
// TODO:ファイル名を.jpg-origからちゃんとしたのに直す
var buttonStyle = "";
var buttonElement = '<div class="ProfileTweet-action Dl-Image"><a download href=""><input type="button" value="画像をDL" style="width: 70px;"></a></div>"';

(function main() {
var tweets = $(".tweet:has(.AdaptiveMedia-photoContainer)");
$.each(tweets, addButton);
})();

function addButton(index, tweet){
  var originUrl = getOriginUrl(tweet);
  $(tweet).find("div.ProfileTweet-actionList").append(buttonElement);
  $(".Dl-Image").find("a").attr("href":originUrl);
}

function getOriginUrl(tweet){
  var imgUrl = $(tweet).find(".AdaptiveMedia-photoContainer > img").attr("src");
  return imgUrl + ":orig";
}
