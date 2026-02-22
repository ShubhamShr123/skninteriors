document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const statusText = document.getElementById('contactFormStatus');
    const submitButton = document.getElementById('contactSubmitBtn');

    if (!form || !statusText || !submitButton) {
        return;
    }

    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw4q_74dtOntW82CbFLrR4anPxqn14-6nUzpJRT7CGvraWaLhkAa85s4TLs4_WaJo8/exec';

    function setStatus(message, type) {
        statusText.textContent = message;
        statusText.classList.remove('success', 'error', 'pending');
        if (type) {
            statusText.classList.add(type);
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        setStatus('Sending your message...', 'pending');

        const formData = new FormData(form);
        formData.append('page', window.location.href);
        formData.append('userAgent', navigator.userAgent || '');
        formData.append('source', 'skninteriors-contact-page');

        const payload = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            payload.append(key, value);
        }

        try {
            await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: payload.toString()
            });

            setStatus('Thanks, we have received your message and will get back to you shortly.', 'success');
            form.reset();
        } catch (error) {
            setStatus('Submission failed. Please try again in a moment.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
});
