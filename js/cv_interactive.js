// Interactive behavior: show modal, select sections, prepare printable version
document.addEventListener('DOMContentLoaded', function(){
  const printBtn = document.getElementById('printBtn');
  const modal = document.getElementById('printModal');
  const cancel = document.getElementById('cancelPrint');
  const confirm = document.getElementById('confirmPrint');
  const form = document.getElementById('printForm');
  const includeSidebar = document.getElementById('includeSidebar');

  const allSections = Array.from(document.querySelectorAll('.section'));

  function openModal(){
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }

  printBtn.addEventListener('click', openModal);
  cancel.addEventListener('click', closeModal);

  confirm.addEventListener('click', function(){
    // determine checked sections
    const checked = Array.from(form.querySelectorAll('input[name="sections"]:checked')).map(i => i.value);
    // hide or show sections
    allSections.forEach(s => {
      const key = s.getAttribute('data-section');
      if(checked.includes(key)) s.style.display = '';
      else s.style.display = 'none';
    });
    // control sidebar inclusion
    if(!includeSidebar.checked){
      document.querySelector('.left').style.display = 'none';
    } else {
      document.querySelector('.left').style.display = '';
    }

    closeModal();
    // small delay to let layout update
    setTimeout(()=> window.print(), 300);
  });

  // Close modal on outside click
  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });

  // Toggle a quick preview print-friendly (single column)
  const togglePreview = document.getElementById('togglePreview');
  togglePreview.addEventListener('click', function(){
    document.body.classList.toggle('print-preview');
    togglePreview.textContent = document.body.classList.contains('print-preview') ? 'Retour' : 'Aperçu imprimable';
    // apply single column styling by toggling css inlined class
    const cv = document.getElementById('cvRoot');
    if(document.body.classList.contains('print-preview')){
      cv.style.gridTemplateColumns = '1fr';
    } else {
      cv.style.gridTemplateColumns = '';
    }
  });
});
