// === SCRIPT POUR LE TÉLÉCHARGEMENT DU CV VISUEL (V3 - Robuste) ===
const visualCvButtons = document.querySelectorAll('.download-visual-cv-btn');

const generateVisualPdf = async (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const originalContent = button.innerHTML;
    if (button.disabled) return;

    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Génération...';
    button.disabled = true;

    try {
        const response = await fetch('assets/md/cv-hybride-larochelle.md');
        if (!response.ok) throw new Error('Fichier CV Markdown introuvable.');
        
        const markdownText = await response.text();
        // Utilise une expression régulière pour séparer par '---' sur une ligne seule
        const sections = markdownText.split(/\n---\n/g);

        const pdfContainer = document.createElement('div');
        pdfContainer.id = 'cv-for-pdf';
        pdfContainer.innerHTML = `
            <div class="cv-header"></div>
            <div class="cv-body">
                <div class="cv-main-col"></div>
                <div class="cv-sidebar-col"></div>
            </div>
            <div class="cv-footer"></div>
        `;
        
        const mainCol = pdfContainer.querySelector('.cv-main-col');
        const sidebarCol = pdfContainer.querySelector('.cv-sidebar-col');

        const sidebarTitles = ['Compétences Clés', 'Formation', 'Pourquoi Moi', 'Ce que je Recherche', 'Centres d\'Intérêt'];
        
        pdfContainer.querySelector('.cv-header').innerHTML = marked.parse(sections[0] || '');
        
        // Gère toutes les sections entre l\'en-tête et le pied de page
        sections.slice(1, sections.length - 1).forEach(section => {
            const firstLine = section.trim().split('\n')[0];
            // Vérifie si le titre de la section est dans la liste des titres de la barre latérale
            if (sidebarTitles.some(title => firstLine.includes(title))) {
                sidebarCol.innerHTML += marked.parse(section);
            } else {
                mainCol.innerHTML += marked.parse(section);
            }
        });

        pdfContainer.querySelector('.cv-footer').innerHTML = marked.parse(sections[sections.length - 1] || '');

        const style = document.createElement('style');
        style.textContent = `
            #cv-for-pdf { --theme-color: #ff6600; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9.5pt; line-height: 1.45; color: #333; background: #fff; }
            .cv-header { padding: 25px 25px 15px 25px; text-align: left; border-bottom: 2px solid var(--theme-color); }
            .cv-header h1 { font-size: 22pt; font-weight: 700; color: #1a1a1a; margin: 0 0 5px 0; }
            .cv-header p { font-size: 10pt; margin: 2px 0; color: #555; }
            .cv-header p strong { font-size: 11pt; font-weight: 500; color: var(--theme-color); }
            .cv-body { display: flex; flex-direction: row; gap: 25px; padding: 25px; }
            .cv-main-col { flex: 2.5; }
            .cv-sidebar-col { flex: 1; border-left: 1px solid #f0f0f0; padding-left: 25px; }
            #cv-for-pdf h2 { font-size: 12pt; font-weight: 600; color: var(--theme-color); border-bottom: 1.5px solid #f0f0f0; padding-bottom: 5px; margin-top: 1.2em; margin-bottom: 1em; }
            #cv-for-pdf h2:first-child { margin-top: 0; }
            #cv-for-pdf h3 { font-size: 10pt; font-weight: 700; color: #222; margin-top: 1.2em; margin-bottom: 0.4em; }
            #cv-for-pdf p, #cv-for-pdf ul { margin-bottom: 0.8em; color: #444; }
            #cv-for-pdf ul { list-style-type: none; padding-left: 0; }
            #cv-for-pdf li { padding-left: 1.2em; position: relative; margin-bottom: 0.4em; }
            #cv-for-pdf li::before { content: '•'; color: var(--theme-color); position: absolute; left: 0; font-weight: bold; top: -1px; }
            #cv-for-pdf strong { font-weight: 600; color: #000; }
            #cv-for-pdf em { color: #555; font-style: italic; }
            .cv-footer { text-align: center; font-style: italic; font-size: 8.5pt; color: #888; padding: 15px 25px; border-top: 1px solid #f0f0f0; }
            #cv-for-pdf hr { display: none; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(pdfContainer);

        const options = { margin: 0, filename: 'CV_Bertrand_Fouquet_Visuel.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
        const pdfBlob = await html2pdf().from(pdfContainer).set(options).outputPdf('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');

        document.body.removeChild(pdfContainer);
        document.head.removeChild(style);

    } catch (error) {
        console.error('Erreur PDF:', error);
        alert('Une erreur est survenue. Le fichier Markdown est peut-être mal structuré (vérifiez les séparateurs ---).');
    } finally {
        button.innerHTML = originalContent;
        button.disabled = false;
    }
};

visualCvButtons.forEach(button => button.addEventListener('click', generateVisualPdf));
