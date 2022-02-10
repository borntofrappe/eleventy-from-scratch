module.exports = {
  getLinkActiveState(itemUrl, pageUrl) {
    let response = "";
    if (itemUrl === pageUrl) {
      response += ' aria-current="page"';
    }

    if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
      response += ' data-state="active"';
    }

    return response;
  },

  getSiblingContent(collection, page, limit = 3, random = true) {
    let filteredItems = collection.filter((d) => d.url !== page.url);

    if (random) {
      let counter = filteredItems.length;

      while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = filteredItems[counter];
        filteredItems[counter] = filteredItems[index];
        filteredItems[index] = temp;
      }
    }

    return limit ? filteredItems.slice(0, limit) : filteredItems;
  },
};
