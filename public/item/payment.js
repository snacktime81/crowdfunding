IMP.init('imp03734354')

function requestPay() {
	let itemName = document.getElementById('itemName').innerHTML;
	const price = (document.getElementsByClassName('totalPrice')[0].innerHTML);
	const priceNumber = Number(price.substring(0, price.length-1))

	//console.log(priceNumber)

	IMP.request_pay({
		pg: "html5_inicis",
		pay_method: "card",
		merchant_uid: "merchant" + new Date().getTime(),
		name: itemName,
		amount: priceNumber,
			
	}, function(rsp) {
		if(rsp.success){
			alert('결제가 완료되었습니다');
			location.href = '/';
		}
		else{
			alert('error' + rsp.error_msg);
			
		}
	});
}