/*
画像を持ってるツイートは#has-cards #has-content を持ってる.
ただし動画とかでもそう.
画像の場合その下に#AdaptiveMedia-photoContainer を持ってる.
この下のimgタグが本体.
(ちなみにgifは動画扱いのよう)
*/
(function main() {
var tweets = $(".tweet:has(.AdaptiveMedia-photoContainer)");
$.each(tweets, addButton);
})();

function addButton(index, tweet){
  var originUrl = getOriginUrl(tweet);
  // TODO: ボタン追加
}

function getOriginUrl(tweet){
  var imgUrl = $(tweet).find(".AdaptiveMedia-photoContainer > img").attr("src");
  return imgUrl + ":orig";
}
