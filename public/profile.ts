const id: number = 

let response = await fetch(`/profile/${id}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'text'
  },
});

let result = await response.json();
alert(result.message);