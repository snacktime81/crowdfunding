async function userDelete() {
  try{
    const confirmPassword: string | null = prompt("삭제를 위해서 비밀번호를 입력해 주세요");
    const userId: string = window.location.pathname;
    const url: string = `/auth${userId}`;

    const response = await fetch(url, {
      method: 'delete',
      headers: {
          'Content-Type': 'application/json'
      }, 
      body : JSON.stringify({ 
        password: confirmPassword
      })
    });
    console.log('re', response)
    if(response.ok){
      window.location.href='/';
    }
    else{
      window.location.href=userId;
    }
  }
  catch(err){
    console.log('err', err);
  }
}