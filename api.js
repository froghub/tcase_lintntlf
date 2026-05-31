const phoneInput = document.getElementById('phone');
const maskOptions = {
    mask: '+7 (000) 000-00-00',
    lazy: false
};
const phoneMask = IMask(phoneInput, maskOptions);

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    if (!phoneMask.masked.isComplete) {
        alert('Пожалуйста, введите номер телефона полностью.');
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.innerText = 'Отправка...';
    btn.disabled = true;

    const payload = {
        name: document.getElementById('name').value,
        phone: phoneMask.value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/.netlify/functions/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Копия письма отправлена на ваш Email.');
            document.getElementById('contactForm').reset();
            phoneMask.updateValue();
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (err) {
        alert('Не удалось отправить форму. Проверьте соединение.');
    } finally {
        btn.innerText = 'Отправить запрос';
        btn.disabled = false;
    }
});
