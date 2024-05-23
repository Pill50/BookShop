document.addEventListener('DOMContentLoaded', () => {
  const toastSuccess = document.getElementById('toast-success');
  const toastDanger = document.getElementById('toast-danger');

  if (toastSuccess) {
    setTimeout(() => {
      toastSuccess.style.display = 'none';
    }, 5000);
  }

  if (toastDanger) {
    setTimeout(() => {
      toastDanger.style.display = 'none';
    }, 5000);
  }

  document.querySelectorAll('[data-dismiss-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(
        button.getAttribute('data-dismiss-target'),
      );
      if (target) {
        target.style.display = 'none';
      }
    });
  });
});
