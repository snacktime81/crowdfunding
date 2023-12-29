const form = document.getElementById('item_content');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const buttonType = document.querySelector('button')
  if(buttonType.id == 'put'){
    itemPut();
  }
  else{
    itemPost();
  }
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

async function itemPost() {
  try {
    const url = window.location.pathname;
    let formData = new FormData(form);

    const object = {};
    formData.forEach(function (value, key) {
      object[key] = value
    })
    let data = JSON.stringify(object)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    alert('생성 되었습니다.');
    window.location.href=url;
  }
  catch (err) {
    console.log(err)
  }
}

async function itemDelete() {
  try{
    const itemId = window.location.pathname.substring(11);
    const url = '/item/'.concat(itemId);
    const response = await fetch(url, {
      method: "DELETE",
    })
    const result = await response;
    if(result.ok){
      alert('삭제 되었습니다.');
      window.location.href=`/`;
    }
  }
  catch(err){
    console.log(err);
  }
}