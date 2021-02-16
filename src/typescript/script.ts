const modal: HTMLDivElement = document.getElementById(
  "modal"
) as HTMLDivElement;
const modalShow: HTMLDivElement = document.getElementById(
  "show-modal"
) as HTMLDivElement;
const modalClose: HTMLDivElement = document.getElementById(
  "close-modal"
) as HTMLDivElement;
const bookmarkForm: HTMLFormElement = document.getElementById(
  "bookmark-form"
) as HTMLFormElement;
const websiteNameEl: HTMLInputElement = document.getElementById(
  "website-name"
) as HTMLInputElement;
const websiteURLEl: HTMLInputElement = document.getElementById(
  "website-url"
) as HTMLInputElement;
const bookmarksContainer: HTMLDivElement = document.getElementById(
  "bookmarks-container"
) as HTMLDivElement;

let bookmarks: {
  name: string;
  url: string;
}[] = [];

function showModal(): void {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e: MouseEvent) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

function validate(nameValue: string, urlValue: string): boolean {
  const expression: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex: RegExp = new RegExp(expression);
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

function buildBookmarks(): void {
  bookmarksContainer.textContent = "";
  bookmarks.forEach((bookmark) => {
    const { name, url }: { name: string; url: string } = bookmark;
    const item: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;
    item.classList.add("item");
    const closeIcon: HTMLElement = document.createElement("i") as HTMLElement;
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    const linkInfo: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;
    linkInfo.classList.add("name");
    const favicon: HTMLImageElement = document.createElement(
      "img"
    ) as HTMLImageElement;
    favicon.setAttribute(
      "src",
      `https://www.google.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", `${name} Favicon`);

    const link: HTMLAnchorElement = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

function fetchBookmarks(): void {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "Mostafa Hassan",
        url: "https://github.com/Mostafa-HEH",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

function deleteBookmark(url: string): void {
  bookmarks.forEach((bookmark, i: number): void => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

function storeBookmark(e: any): boolean {
  interface bookmark {
    name: string;
    url: string;
  }
  e.preventDefault();
  const nameValue: string = websiteNameEl.value;
  let urlValue: string = websiteURLEl.value;

  let conditions: string[] = ["http://", "https://"];
  if (!conditions.some((el: string) => urlValue.includes(el))) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark: bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

bookmarkForm.addEventListener("submit", storeBookmark);

fetchBookmarks();
