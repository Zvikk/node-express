document.addEventListener('DOMContentLoaded', () => {
  const cartTable = document.querySelector('.js-cart-table');

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
