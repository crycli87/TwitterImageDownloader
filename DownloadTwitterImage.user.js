// TODO: 複数ファイルDL時になんか許可が必要なの治す
var buttonStyle = "";
var buttonElement = '<div class="ProfileTweet-action Dl-Image"><input type="button" value="画像をDL" style="width: 70px;"></div>"';

(function main() {
var tweets = $(".tweet:has(.AdaptiveMedia-photoContainer)");
// TODO: 動的に読み込まれた奴にボタン適応できてないようす.
$.each(tweets, addButton);
})();

function addButton(index, tweet){
  var originUrls = getOriginUrls(tweet);
  $(tweet).find("div.ProfileTweet-actionList").append(buttonElement);
  $(tweet).find("input").bind("click", {urls:originUrls}, download);
}

function download(event){
  var urls = event.data.urls;
  urls.forEach(function(url,i,ar){
    var request = new XMLHttpRequest();
    var fileName = getFileName(url);
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
