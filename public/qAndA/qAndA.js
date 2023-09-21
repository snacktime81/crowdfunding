const onQuestion =  async() => {
    try{
        const form = document.getElementById('qForm');
        const formData = new FormData(form);

        let jQuestion = {}
        jQuestion['question'] = formData.get('question'); // 질문 내용

        const response = await fetch("/qAndA", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jQuestion)
        });
    }
    catch(err){
        
    }


}