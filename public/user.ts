
async function userDelete() {
  try{
    const confirmPassword: string | null = prompt("삭제를 위해서 비밀번호를 입력해 주세요");
    const userId: string = window.location.pathname;
    const url = `/auth${userId}`;
    console.log(url)

    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            password: confirmPassword
        })
      });
      
      let result = await response.json();
      alert(result);
    }
    catch(err){
      console.log(err)
    }
}