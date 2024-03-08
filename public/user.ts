async function userDelete() {
    try {
        const confirmPassword: string | null = prompt("삭제를 위해서 비밀번호를 입력해 주세요");
        const userId: string = window.location.pathname;
        const url: string = `auth${userId}`;

        const response = await fetch(url, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: confirmPassword
            })
        });
        const path = await response.json();
        if (path == '/') {
            alert('삭제되었습니다.');
            window.location.href = path;
        } else {
            alert('비밀번호가 올바르지 않습니다.');
            window.location.href = path;
        }
    } catch (err) {
        console.log('err', err);
    }
}

function nullCheck(data: HTMLFormElement | null | HTMLElement): data is null {
    if (typeof (data) == null) {
        return true
    } else {
        return false
    }
}

// @ts-ignore
const form: HTMLFormElement | null = document.getElementById('userData') as HTMLFormElement;
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const c = e.submitter;
    if (nullCheck(c)) {
        alert('다시 시도해 주세요');
        window.location.href = '/';
    } else if (c.className == 'b1') {
        userPut()
    } else if(c.className == 'button.b2') {
        userDelete();
    }
})

async function userPut() {
    try {
        const confirmData = confirm("유저 정보 변경에 동의 하십니까?");
        const userId = window.location.pathname;
        const url = `auth${userId}`

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
                const id = await response.json();
                window.location.href = id;
            }
        }
    } catch (err) {
        console.log(err)
    }
}