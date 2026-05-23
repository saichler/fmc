/*
© 2025 Sharon Aicler (saichler@gmail.com)
Layer 8 Ecosystem is licensed under the Apache License, Version 2.0.
*/

const sections = {
    dashboard: 'sections/dashboard.html',
    core: 'sections/core.html',
    coaching: 'sections/coaching.html',
    nutrition: 'sections/nutrition.html',
    progress: 'sections/progress.html',
    billing: 'sections/billing.html',
    system: 'sections/system.html'
};

const sectionInitializers = {
    dashboard: () => {
        if (typeof initializeFmcDashboard === 'function') initializeFmcDashboard();
    },
    core: () => {
        if (typeof initializeFmcCore === 'function') initializeFmcCore();
    },
    coaching: () => {
        if (typeof initializeFmcCoaching === 'function') initializeFmcCoaching();
    },
    nutrition: () => {
        if (typeof initializeFmcNutrition === 'function') initializeFmcNutrition();
    },
    progress: () => {
        if (typeof initializeFmcProgress === 'function') initializeFmcProgress();
    },
    billing: () => {
        if (typeof initializeFmcBilling === 'function') initializeFmcBilling();
    },
    system: () => {
        if (typeof initializeL8Sys === 'function') initializeL8Sys();
    }
};

function loadSection(sectionName) {
    const contentArea = document.getElementById('content-area');
    const sectionFile = sections[sectionName];

    if (!sectionFile) {
        contentArea.innerHTML = '<div class="section-container"><h2>Section not found.</h2></div>';
        return;
    }

    contentArea.style.opacity = '0';
    contentArea.style.transform = 'translateY(20px)';

    fetch(sectionFile + '?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error('Section not found');
            return response.text();
        })
        .then(html => {
            setTimeout(() => {
                contentArea.innerHTML = html;

                const placeholder = contentArea.querySelector('[id$="-section-placeholder"]');
                if (placeholder && window.Layer8SectionGenerator) {
                    const generatedHtml = Layer8SectionGenerator.generate(sectionName);
                    const temp = document.createElement('div');
                    temp.innerHTML = generatedHtml;
                    placeholder.replaceWith(...temp.children);
                }

                setTimeout(() => {
                    contentArea.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    contentArea.style.opacity = '1';
                    contentArea.style.transform = 'translateY(0)';
                }, 50);

                if (sectionInitializers[sectionName]) {
                    sectionInitializers[sectionName]();
                }
            }, 200);
        })
        .catch(() => {
            contentArea.innerHTML = '<div class="section-container"><h2>Failed to load section.</h2></div>';
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateY(0)';
        });
}
