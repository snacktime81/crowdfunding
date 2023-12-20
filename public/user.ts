async function userDelete() {
  try {
    const confirmPassword: string | null = prompt("삭제를 위해서 비밀번호를 입력해 주세요");
    const userId: string = window.location.pathname;
    const url: string = `/auth${userId}`;

    const response = await fetch(url, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: confirmPassword
      })
    });
    if (response.ok) {
      window.location.href = '/';
    }
    else {
      window.location.href = userId;
    }
  }
  catch (err) {
    console.log('err', err);
  }
}

function nullCheck(data: HTMLFormElement | null): data is null {
  if (typeof (data) == null) {
    return true
  }
  else {
    return false
  }
}

const form: HTMLFormElement | null = document.getElementById('userData') as HTMLFormElement;
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  userPut();
})

async function userPut() {
  try {
    const confirmData = confirm("유저 정보 변경에 동의 하십니까?");
    const userId = window.location.pathname;
    const url = `auth/${userId}`
    
    console.log(form);
    if (confirmData) {
      if (!nullCheck(form)) {
          let formData = new FormData(form);

          const object: { [key: string]: FormDataEntryValue } = {};
          formData.forEach(function (value, key: string) {
            object[key] = value
          })

          let data = JSON.stringify(object)
          console.log('data', data)
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: data
          });
      }
    }
    window.location.href=userId;
  }
  catch (err) {
    console.log(err)
  }
}