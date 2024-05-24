document.addEventListener('DOMContentLoaded', (req, res) => {
  const toastSuccess = document.getElementById('toast-success');
  const toastDanger = document.getElementById('toast-danger');

  if (toastSuccess) {
    setTimeout(() => {
      toastSuccess.style.display = 'none';
      toastSuccess.parentNode.removeChild(toastSuccess);
      clearSessionMessages();
    }, 5000);
  }

  if (toastDanger) {
    setTimeout(() => {
      toastDanger.style.display = 'none';
      toastDanger.parentNode.removeChild(toastDanger);
      clearSessionMessages();
    }, 5000);
  }

  document.querySelectorAll('[data-dismiss-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(
        button.getAttribute('data-dismiss-target'),
      );
      if (target) {
        target.style.display = 'none';
        clearSessionMessages();
      }
    });
  });

  function clearSessionMessages() {
    fetch('/admin/auth/clear-session-messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
});
