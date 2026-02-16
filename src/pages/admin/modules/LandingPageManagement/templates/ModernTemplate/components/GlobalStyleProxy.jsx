import React from 'react';

export default function GlobalStyleProxy({ themeColors }) {
  if (!themeColors) return null;

  // 1. Convert DB keys to CSS Variables
  // This allows you to use var(--primary-color) in your Custom CSS box
  const cssVariables = `
    :root {
      --primary-color: ${themeColors.primary_color || '#FF6B35'};
      --secondary-color: ${themeColors.secondary_color || '#FFB800'};
      --text-primary: ${themeColors.text_primary || '#1F2937'};
      --text-secondary: ${themeColors.text_secondary || '#6B7280'};
      --bg-primary: ${themeColors.background_primary || '#FFFFFF'};
      --bg-secondary: ${themeColors.background_secondary || '#F8F9FC'};
      --bg-dark: ${themeColors.background_dark || '#1A202C'};
      
      /* Derived Colors for overlays */
      --overlay-color: ${themeColors.overlay_color || 'rgba(0,0,0,0.5)'};
    }

    /* 2. Apply Base Styles */
    body {
      color: var(--text-primary);
      background-color: var(--bg-primary);
    }

    /* 3. Helper Classes for Custom CSS Targeting */
    .text-primary-theme { color: var(--primary-color) !important; }
    .bg-primary-theme { background-color: var(--primary-color) !important; }
    .btn-primary-theme { 
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color)) !important;
      color: #fff !important;
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ 
      __html: `
        ${cssVariables}
        
        /* 4. INJECT USER CUSTOM CSS */
        /* This comes last to override everything else */
        ${themeColors.custom_css || ''}
      ` 
    }} />
  );
}