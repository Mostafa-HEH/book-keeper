var modal = document.getElementById("modal");
var modalShow = document.getElementById("show-modal");
var modalClose = document.getElementById("close-modal");
var bookmarkForm = document.getElementById("bookmark-form");
var websiteNameEl = document.getElementById("website-name");
var websiteURLEl = document.getElementById("website-url");
var bookmarksContainer = document.getElementById("bookmarks-container");
var bookmarks = [];
function showModal() {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", function () {
    return modal.classList.remove("show-modal");
});
window.addEventListener("click", function (e) {
    return e.target === modal ? modal.classList.remove("show-modal") : false;
});
function validate(nameValue, urlValue) {
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    var regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert("Please submit values for both fields.");
        return false;
    }
    if (!urlValue.match(regex)) {
        alert("Please provide a valid web adress");
        return false;
    }
    return true;
}
function buildBookmarks() {
    bookmarksContainer.textContent = "";
    bookmarks.forEach(function (bookmark) {
        var name = bookmark.name, url = bookmark.url;
        var item = document.createElement("div");
        item.classList.add("item");
        var closeIcon = document.createElement("i");
        closeIcon.classList.add("fas", "fa-times");
        closeIcon.setAttribute("title", "Delete Bookmark");
        closeIcon.setAttribute("onclick", "deleteBookmark('" + url + "')");
        var linkInfo = document.createElement("div");
        linkInfo.classList.add("name");
        var favicon = document.createElement("img");
        favicon.setAttribute("src", "https://www.google.com/s2/favicons?domain=" + url);
        favicon.setAttribute("alt", name + " Favicon");
        var link = document.createElement("a");
        link.setAttribute("href", "" + url);
        link.setAttribute("target", "_blank");
        link.textContent = name;
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}
function fetchBookmarks() {
    if (localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    }
    else {
        bookmarks = [
            {
                name: "Mostafa Hassan",
                url: "https://github.com/Mostafa-HEH"
            },
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
}
function deleteBookmark(url) {
    bookmarks.forEach(function (bookmark, i) {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
}
function storeBookmark(e) {
    e.preventDefault();
    var nameValue = websiteNameEl.value;
    var urlValue = websiteURLEl.value;
    var conditions = ["http://", "https://"];
    if (!conditions.some(function (el) { return urlValue.includes(el); })) {
        urlValue = "https://" + urlValue;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    var bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}
bookmarkForm.addEventListener("submit", storeBookmark);
fetchBookmarks();
