const prices = {
    mingguan: 1,
    bulanan: 3,
    tahunan: 10
};

document.querySelectorAll('input[name="duration"]').forEach(radio => {
    radio.addEventListener('change', () => {
    const multiplier = prices[radio.value];
    document.querySelectorAll('.product-card').forEach(card => {
        const base = parseInt(card.dataset.base);
        card.querySelector('.price').textContent = 'Rp' + (base * multiplier).toLocaleString();
    });
    });
});

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