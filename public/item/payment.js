IMP.init('imp03734354')

function requestPay() {
	let itemName = document.getElementById('itemName').innerHTML;
	const price = (document.getElementsByClassName('totalPrice')[0].innerHTML);
	const priceNumber = Number(price.substring(0, price.length-1))

	//console.log(priceNumber)
	const form = document.getElementById('form');

			
	const totalPrice = document.getElementsByClassName('totalPrice')[0].innerHTML;
	//console.log(totalPrice.substring(0, totalPrice.length - 1))
	const itemId = window.location.pathname.substring(6);
	let formData = new FormData(form);
	formData.append('itemId', itemId);
	formData.append('price', totalPrice);
	
	let object = {}
	formData.forEach(function(value,key){
		object[key]=value
	})

	let data = JSON.stringify(object)
	console.log(data)
	
	IMP.request_pay({
		pg: "html5_inicis",
		pay_method: "card",
		merchant_uid: "merchant" + new Date().getTime(),
		name: itemName,
		amount: priceNumber,
			
	}, async function (rsp) {
		if(rsp.success){
			alert('결제가 완료되었습니다');
			const response = await fetch("/item/order", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: data
			});
		
			location.href = '/';
		}
		else{
			alert('error' + rsp.error_msg);
			
		}
	});
}