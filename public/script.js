

document.getElementById('orderForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = new URLSearchParams(new FormData(form));

    const response = await fetch('/contact', {
        method:'POST',
        body:data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const text = await response.text();
    document.getElementById('responseMsg').textContent = text;
    form.reset();
});