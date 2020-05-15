document.addEventListener('DOMContentLoaded', () => {
  const cartTable = document.querySelector('.js-cart-table');
  const tabs = document.querySelector('.tabs');

  if (tabs) {
    const instance = M.Tabs.init(tabs, {});
    /* instance.tabs(); */
  }

  if (cartTable) {
    cartTable.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.id;
        fetch('/cart/remove/' + id, { method: 'delete' })
          .then(() => location.reload());
      }
    });
  }
});
