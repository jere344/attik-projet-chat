// CV Templates - Each template is a function that takes cvData and returns HTML

export const templates = {
  modern: {
    name: 'Moderne',
    render: (cvData) => `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <header style="border-bottom: 3px solid #2196F3; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1a1a1a; font-size: 2.5rem; font-weight: 600;">${cvData.fullName || 'Votre Nom'}</h1>
          <p style="margin: 5px 0 0; color: #2196F3; font-size: 1.2rem; font-weight: 500;">${cvData.title || 'Titre Professionnel'}</p>
          <div style="margin-top: 15px; color: #666; font-size: 0.9rem;">
            ${cvData.email ? `<span style="margin-right: 20px;">📧 ${cvData.email}</span>` : ''}
            ${cvData.phone ? `<span style="margin-right: 20px;">📱 ${cvData.phone}</span>` : ''}
            ${cvData.location ? `<span>📍 ${cvData.location}</span>` : ''}
          </div>
        </header>

        ${cvData.summary ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #2196F3; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Profil</h2>
          <p style="color: #444; line-height: 1.6; margin: 0;">${cvData.summary}</p>
        </section>
        ` : ''}

        ${cvData.experience?.length ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #2196F3; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Expérience</h2>
          ${cvData.experience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; color: #1a1a1a; font-size: 1.1rem;">${exp.position}</h3>
                <span style="color: #888; font-size: 0.9rem;">${exp.period}</span>
              </div>
              <p style="margin: 3px 0 8px; color: #2196F3; font-weight: 500;">${exp.company}</p>
              <p style="margin: 0; color: #555; line-height: 1.5; font-size: 0.95rem;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${cvData.education?.length ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #2196F3; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Formation</h2>
          ${cvData.education.map(edu => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; color: #1a1a1a; font-size: 1rem;">${edu.degree}</h3>
                <span style="color: #888; font-size: 0.9rem;">${edu.period}</span>
              </div>
              <p style="margin: 3px 0 0; color: #666;">${edu.school}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}

        <div style="display: flex; gap: 40px;">
          ${cvData.skills?.length ? `
          <section style="flex: 1;">
            <h2 style="color: #2196F3; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Compétences</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${cvData.skills.map(skill => `<span style="background: #e3f2fd; color: #1976d2; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">${skill}</span>`).join('')}
            </div>
          </section>
          ` : ''}

          ${cvData.languages?.length ? `
          <section style="flex: 1;">
            <h2 style="color: #2196F3; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Langues</h2>
            <ul style="margin: 0; padding-left: 20px; color: #555;">
              ${cvData.languages.map(lang => `<li style="margin-bottom: 5px;">${lang}</li>`).join('')}
            </ul>
          </section>
          ` : ''}
        </div>
      </div>
    `,
  },

  classic: {
    name: 'Classique',
    render: (cvData) => `
      <div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <header style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #000; font-size: 2rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">${cvData.fullName || 'Votre Nom'}</h1>
          <p style="margin: 10px 0 0; color: #333; font-size: 1.1rem; font-style: italic;">${cvData.title || 'Titre Professionnel'}</p>
          <div style="margin-top: 15px; color: #555; font-size: 0.9rem;">
            ${[cvData.email, cvData.phone, cvData.location].filter(Boolean).join(' | ')}
          </div>
        </header>

        ${cvData.summary ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #000; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px;">Profil Professionnel</h2>
          <p style="color: #333; line-height: 1.6; margin: 0; text-align: justify;">${cvData.summary}</p>
        </section>
        ` : ''}

        ${cvData.experience?.length ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #000; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Expérience Professionnelle</h2>
          ${cvData.experience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="color: #000;">${exp.position}</strong>
                <em style="color: #555;">${exp.period}</em>
              </div>
              <p style="margin: 2px 0 8px; color: #333; font-style: italic;">${exp.company}</p>
              <p style="margin: 0; color: #444; line-height: 1.5; text-align: justify;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${cvData.education?.length ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #000; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Formation</h2>
          ${cvData.education.map(edu => `
            <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
              <div>
                <strong>${edu.degree}</strong>
                <span style="color: #555;"> — ${edu.school}</span>
              </div>
              <em style="color: #555;">${edu.period}</em>
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${cvData.skills?.length ? `
        <section style="margin-bottom: 25px;">
          <h2 style="color: #000; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px;">Compétences</h2>
          <p style="margin: 0; color: #333;">${cvData.skills.join(' • ')}</p>
        </section>
        ` : ''}

        ${cvData.languages?.length ? `
        <section>
          <h2 style="color: #000; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px;">Langues</h2>
          <p style="margin: 0; color: #333;">${cvData.languages.join(' • ')}</p>
        </section>
        ` : ''}
      </div>
    `,
  },

  minimal: {
    name: 'Minimaliste',
    render: (cvData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 50px; background: white;">
        <header style="margin-bottom: 40px;">
          <h1 style="margin: 0; color: #000; font-size: 2rem; font-weight: 300;">${cvData.fullName || 'Votre Nom'}</h1>
          <p style="margin: 8px 0 0; color: #666; font-size: 1rem; font-weight: 400;">${cvData.title || 'Titre Professionnel'}</p>
          <div style="margin-top: 12px; color: #999; font-size: 0.85rem;">
            ${[cvData.email, cvData.phone, cvData.location].filter(Boolean).join(' · ')}
          </div>
        </header>

        ${cvData.summary ? `
        <section style="margin-bottom: 35px;">
          <p style="color: #333; line-height: 1.7; margin: 0; font-size: 0.95rem;">${cvData.summary}</p>
        </section>
        ` : ''}

        ${cvData.experience?.length ? `
        <section style="margin-bottom: 35px;">
          <h2 style="color: #999; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Expérience</h2>
          ${cvData.experience.map(exp => `
            <div style="margin-bottom: 25px;">
              <h3 style="margin: 0; color: #000; font-size: 1rem; font-weight: 500;">${exp.position}</h3>
              <p style="margin: 4px 0 10px; color: #666; font-size: 0.9rem;">${exp.company} · ${exp.period}</p>
              <p style="margin: 0; color: #444; line-height: 1.6; font-size: 0.9rem;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${cvData.education?.length ? `
        <section style="margin-bottom: 35px;">
          <h2 style="color: #999; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Formation</h2>
          ${cvData.education.map(edu => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0; color: #000; font-size: 0.95rem; font-weight: 500;">${edu.degree}</h3>
              <p style="margin: 4px 0 0; color: #666; font-size: 0.85rem;">${edu.school} · ${edu.period}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}

        <div style="display: flex; gap: 60px;">
          ${cvData.skills?.length ? `
          <section>
            <h2 style="color: #999; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Compétences</h2>
            <ul style="margin: 0; padding: 0; list-style: none; color: #444; font-size: 0.9rem; line-height: 1.8;">
              ${cvData.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </section>
          ` : ''}

          ${cvData.languages?.length ? `
          <section>
            <h2 style="color: #999; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Langues</h2>
            <ul style="margin: 0; padding: 0; list-style: none; color: #444; font-size: 0.9rem; line-height: 1.8;">
              ${cvData.languages.map(lang => `<li>${lang}</li>`).join('')}
            </ul>
          </section>
          ` : ''}
        </div>
      </div>
    `,
  },
};

export const templateList = Object.entries(templates).map(([key, { name }]) => ({ key, name }));

export function renderCV(templateKey, cvData) {
  const template = templates[templateKey] || templates.modern;
  return template.render(cvData || {});
}
