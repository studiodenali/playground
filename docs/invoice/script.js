function invoiceidWrite() {
    document.getElementById('invoicevariable-invoiceid').innerHTML = document.getElementById('invoice-input-invoicenumber').value;
}

function invoicePurchaserNameWrite() {
    document.getElementById('invoice-variable-purchasername').innerHTML = document.getElementById('invoice-input-purchasername').value;
}

function printDiv() {
    var divContents = document.getElementById("paper").innerHTML;
    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}