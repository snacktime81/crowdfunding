
const span = document.getElementsByClassName('totalPrice');
console.log(span)
const amount = span.value;
console.log(amount)
IMP.init('imp03734354')

function requestPay(name) {
	IMP.request_pay({
		pg: "html5_inicis",
		pay_method: "card",
		merchant_uid: "merchant" + new Date().getTime(),
		name: 'test',
		amount: 100,
			
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