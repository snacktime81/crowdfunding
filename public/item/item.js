const form = document.getElementById('item_content');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  itemPut();
})

const button = document.getElementById('delete');

button.addEventListener('click', (e) => {
  e.preventDefault();
  itemDelete();
})

async function itemPut() {
  try {
    const url = window.location.pathname;
    let formData = new FormData(form);

    const object = {};
    formData.forEach(function (value, key) {
      object[key] = value
    })
    let data = JSON.stringify(object)

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    alert('변경 되었습니다.');
    window.location.href=url;
  }
  catch (err) {
    console.log(err)
  }
}

async function itemDelete() {
  const itemId = window.location.pathname.substring(11);
  const url = '/item/'.concat(itemId);
  const response = await fetch(url, {
    method: "DELETE",
  })
  alert('삭제 되었습니다.');
  window.location.href=`/`;
}