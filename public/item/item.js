const form = document.getElementById('item_content');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  itemPut();
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