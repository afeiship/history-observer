// magnet:?xt=urn:btih:a737c9001660e1afeeefe7693c14e6a0c99c9ce2&dn=Tom And Jerry (Huge Mega Pack) 100% Classics

var els = document.querySelectorAll('.list-group-item .label .icon-checkbox');
els = [].slice.call(els);

els.forEach((item, index) => {
  if (index >= 500) {
    item.click();
  }
});
