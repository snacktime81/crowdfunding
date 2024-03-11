function getPercent() {

    let percentInput = document.getElementById('percent_input');

    const div = document.querySelector(".product-price");
    let span = div.querySelector('span');
    if (span) {
        div.removeChild(span);
    }

    const percent = percentInput.value;

    let price = document.getElementById('price').innerHTML;

    span = document.createElement('span');
    span.className = 'totalPrice';
    span.innerHTML = `${price * percent}₩`;
    div.insertBefore(span, div.firstChild);
}

const inputElement = document.getElementById('percent_input');

inputElement.addEventListener('input', function () {
    const inputValue = parseInt(inputElement.value);
    const maxValue = parseInt(inputElement.getAttribute('max'));

    if (inputValue > maxValue) {
        inputElement.value = maxValue;
    }
});