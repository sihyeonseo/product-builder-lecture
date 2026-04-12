document.addEventListener('DOMContentLoaded', () => {
  const btnContact = document.getElementById('btn-contact');
  const btnComments = document.getElementById('btn-comments');
  const sectionContact = document.getElementById('section-contact');
  const sectionComments = document.getElementById('section-comments');
  const closeBtns = document.querySelectorAll('.close-btn');

  // Show Contact Section
  btnContact.addEventListener('click', () => {
    sectionContact.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  });

  // Show Comments Section
  btnComments.addEventListener('click', () => {
    sectionComments.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  });

  // Close Sections
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sectionContact.classList.add('hidden');
      sectionComments.classList.add('hidden');
      document.body.style.overflow = 'auto'; // Restore scroll
    });
  });

  // Close on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === sectionContact) {
      sectionContact.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
    if (e.target === sectionComments) {
      sectionComments.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
});
