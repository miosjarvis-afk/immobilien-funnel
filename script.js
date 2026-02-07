// ==================== CONFIG ====================
const TELEGRAM_BOT_TOKEN = '8097168362:AAG4aeWZF_iL_jg0D0chIt49HuQc20QrINc';
const TELEGRAM_CHAT_ID = '830554328';

// Analytics Storage
let analytics = JSON.parse(localStorage.getItem('funnel_analytics') || '{"views":0,"quizStarts":0,"quizComplete":0,"leads":0,"leadsList":[]}');

// ==================== QUIZ DATA ====================
const quizQuestions = [
    {
        id: 'q1_goal',
        question: 'Was ist dein Ziel mit Immobilien?',
        context: '',
        options: [
            { text: 'Langfristig passiv Vermögen aufbauen', value: 'wealth', score: 3 },
            { text: 'Zusätzliche Einnahmen neben dem Job', value: 'income', score: 3 },
            { text: 'Altersvorsorge & Sicherheit', value: 'retirement', score: 3 },
            { text: 'Ich informiere mich aktuell', value: 'research', score: 1 }
        ]
    },
    {
        id: 'q2_timing',
        question: 'Wann möchtest du prüfen, ob eine erste Kapitalanlage für dich passt?',
        context: '',
        options: [
            { text: 'So schnell wie möglich', value: 'asap', score: 3 },
            { text: 'In den nächsten 6 Monaten', value: '0-6m', score: 3 },
            { text: '6–12 Monate', value: '6-12m', score: 2 },
            { text: 'Noch offen', value: 'open', score: 0 }
        ]
    },
    {
        id: 'q3_income',
        question: 'In welchem Bereich liegt dein monatliches Nettoeinkommen?',
        context: '',
        options: [
            { text: 'Unter 4\'500 CHF', value: '<4500', score: 0 },
            { text: '4\'500–6\'000 CHF', value: '4500-6000', score: 2 },
            { text: '6\'000–8\'000 CHF', value: '6000-8000', score: 4 },
            { text: 'Über 8\'000 CHF', value: '8000+', score: 5 }
        ]
    },
    {
        id: 'q4_equity',
        question: 'Wie viel Eigenkapital könntest du einsetzen, ohne deine Sicherheit zu gefährden?',
        context: '',
        options: [
            { text: 'Unter 20\'000 CHF', value: '<20k', score: 1 },
            { text: '20\'000–40\'000 CHF', value: '20-40k', score: 2 },
            { text: '40\'000–80\'000 CHF', value: '40-80k', score: 4 },
            { text: 'Über 80\'000 CHF', value: '80k+', score: 5 }
        ]
    },
    {
        id: 'q5_employment',
        question: 'Wie ist deine aktuelle berufliche Situation?',
        context: '',
        options: [
            { text: 'Festangestellt (unbefristet)', value: 'permanent', score: 4 },
            { text: 'Festangestellt (befristet)', value: 'temporary', score: 2 },
            { text: 'Selbstständig', value: 'self-employed', score: 2 },
            { text: 'In Ausbildung/Studium', value: 'education', score: 0 }
        ]
    },
    {
        id: 'q6_lifesituation',
        question: 'Wie sieht deine aktuelle Lebenssituation aus?',
        context: '',
        options: [
            { text: 'Alleinstehend', value: 'single', score: 1 },
            { text: 'Partnerschaft (keine Kinder)', value: 'couple', score: 1 },
            { text: 'Partnerschaft mit Kindern', value: 'family', score: 0 }
        ]
    }
];

// ==================== STATE ====================
let currentQuestion = 0;
let answers = {};
let quizStartTime = null;

// ==================== TRACKING ====================
function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, params);
    }
    console.log('Event tracked:', eventName, params);
}

// ==================== QUIZ FUNCTIONS ====================
function startQuiz() {
    quizStartTime = Date.now();
    currentQuestion = 0;
    answers = {};
    trackEvent('StartQuiz', { quiz_name: 'immobilien_check' });
    trackAnalyticsEvent('quiz_start');
    document.getElementById('quiz-container').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderQuestion();
}

function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    const container = document.getElementById('quiz-questions');
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `Schritt ${currentQuestion + 1} von ${quizQuestions.length}`;
    
    container.innerHTML = `
        <div class="quiz-question">
            <h3>${question.question}</h3>
            ${question.context ? `<p class="context">${question.context}</p>` : ''}
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectOption('${question.id}', '${option.value}', ${option.score}, ${index})">
                        ${option.text}
                    </div>
                `).join('')}
            </div>
            <p class="micro-text" style="text-align: center; margin-top: 24px;">
                Keine Sorge – du brauchst keine exakten Zahlen. Bereiche reichen.
            </p>
        </div>
        <div class="quiz-nav">
            ${currentQuestion > 0 ? '<button class="btn-back" onclick="previousQuestion()">Zurück</button>' : '<div></div>'}
            <button class="btn-next" id="btn-next" onclick="nextQuestion()" disabled>Weiter</button>
        </div>
    `;
    
    if (answers[question.id]) {
        const selectedIndex = question.options.findIndex(opt => opt.value === answers[question.id].value);
        if (selectedIndex >= 0) {
            const options = document.querySelectorAll('.quiz-option');
            options[selectedIndex].classList.add('selected');
            document.getElementById('btn-next').disabled = false;
        }
    }
    trackEvent('QuizQuestion', { question_number: currentQuestion + 1, question_id: question.id });
}

function selectOption(questionId, value, score, index) {
    answers[questionId] = { value, score };
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.quiz-option')[index].classList.add('selected');
    document.getElementById('btn-next').disabled = false;
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        completeQuiz();
    }
}

function completeQuiz() {
    const duration = Math.round((Date.now() - quizStartTime) / 1000);
    trackEvent('QuizComplete', { duration_seconds: duration, total_questions: quizQuestions.length });
    trackAnalyticsEvent('quiz_complete');
    showLoading();
    const score = calculateScore();
    setTimeout(() => showMiniResult(score), 2000);
}

function calculateScore() {
    return Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
}

function showLoading() {
    document.getElementById('quiz-questions').innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="width: 60px; height: 60px; border: 4px solid #e9ecef; border-top-color: #c9a35b; border-radius: 50%; margin: 0 auto 24px; animation: spin 1s linear infinite;"></div>
            <h3 style="color: #0a1628; margin-bottom: 12px;">Wir werten deine Angaben aus...</h3>
            <p style="color: #495057; font-size: 15px; margin-bottom: 32px;">Analysiere Einkommen, Eigenkapital und Lebenssituation...</p>
            <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; max-width: 300px; margin: 0 auto;">
                <div style="background: linear-gradient(90deg, #152a47 0%, #c9a35b 100%); height: 100%; width: 0%; animation: progress 2s ease-out forwards;"></div>
            </div>
        </div>
        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes progress { to { width: 100%; } }
        </style>
    `;
}

function showMiniResult(score) {
    const level = getEignungslevel(score);
    document.getElementById('quiz-questions').innerHTML = `
        <div class="quiz-question">
            <h3 style="text-align: center; color: #c9a35b;">Deine Ausgangslage ist grundsätzlich ${level.label.toLowerCase()}.</h3>
            <ul style="list-style: none; margin: 32px 0; padding: 0;">
                <li style="padding: 12px 0; font-size: 16px;">✓ Einkommen liegt im relevanten Bereich</li>
                <li style="padding: 12px 0; font-size: 16px;">✓ Eigenkapital ist grundsätzlich einsetzbar</li>
                <li style="padding: 12px 0; font-size: 16px;">✓ Ziel passt zu langfristigem Vermögensaufbau</li>
            </ul>
            <p style="color: #495057; margin: 24px 0; line-height: 1.8;">
                Für eine fundierte Einschätzung sind 1–2 Punkte kurz persönlich zu klären – das lässt sich nicht sinnvoll automatisieren.
            </p>
            <button class="cta-button" onclick="showLeadForm()" style="width: 100%; margin-top: 24px;">
                Persönliches Ergebnis erhalten
            </button>
        </div>
    `;
}

function showLeadForm() {
    document.getElementById('quiz-questions').innerHTML = `
        <div class="quiz-question">
            <h3 style="text-align: center;">Dein persönliches Ergebnis + kurze Einordnung</h3>
            <p style="color: #495057; margin: 24px 0; text-align: center; line-height: 1.8;">
                Wir senden dir dein vollständiges Ergebnis per E-Mail und klären es auf Wunsch kurz telefonisch (5–10 Min), damit du eine realistische Einschätzung bekommst.
            </p>
            <form id="lead-form" onsubmit="submitLead(event)" style="max-width: 500px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Vorname *</label>
                    <input type="text" id="firstName" required style="width: 100%; padding: 12px; border: 2px solid #dee2e6; border-radius: 8px; font-size: 16px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">E-Mail *</label>
                    <input type="email" id="email" required style="width: 100%; padding: 12px; border: 2px solid #dee2e6; border-radius: 8px; font-size: 16px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Telefonnummer *</label>
                    <input type="tel" id="phone" required style="width: 100%; padding: 12px; border: 2px solid #dee2e6; border-radius: 8px; font-size: 16px;">
                    <p style="font-size: 13px; color: #495057; margin-top: 8px;">
                        Deine Nummer wird nur für diese Einordnung verwendet – nicht für Werbung und nicht ohne dein Einverständnis weitergegeben.
                    </p>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: flex; align-items: start; cursor: pointer;">
                        <input type="checkbox" id="consent" required style="margin-right: 12px; margin-top: 4px;">
                        <span style="font-size: 14px; color: #495057;">
                            Ich bin einverstanden, telefonisch zur Ergebnis-Einordnung kontaktiert zu werden.
                        </span>
                    </label>
                </div>
                <button type="submit" class="cta-button" style="width: 100%;">
                    Ergebnis freischalten
                </button>
            </form>
        </div>
    `;
}

async function submitLead(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const consent = document.getElementById('consent').checked;
    const score = calculateScore();
    const level = getEignungslevel(score);
    
    trackEvent('Lead', { value: 1, currency: 'CHF', score: score, level: level.label });
    
    const leadData = {
        firstName, email, phone, consent, score,
        level: level.label, answers,
        timestamp: new Date().toISOString(),
        source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
        userAgent: navigator.userAgent
    };
    
    trackAnalyticsEvent('lead', leadData);
    await sendToTelegram(leadData);
    showFullResult(leadData);
}

async function sendToTelegram(leadData) {
    const message = `🎯 NEUER LEAD - Immobilien-Check

👤 Name: ${leadData.firstName}
📧 E-Mail: ${leadData.email}
📱 Telefon: ${leadData.phone}

📊 Ergebnis:
• Score: ${leadData.score} Punkte
• Level: ${leadData.level}

📋 Antworten:
• Ziel: ${leadData.answers?.q1_goal?.value || '-'}
• Timing: ${leadData.answers?.q2_timing?.value || '-'}
• Einkommen: ${leadData.answers?.q3_income?.value || '-'}
• Eigenkapital: ${leadData.answers?.q4_equity?.value || '-'}
• Anstellung: ${leadData.answers?.q5_employment?.value || '-'}
• Lebenssituation: ${leadData.answers?.q6_lifesituation?.value || '-'}

✅ Consent: ${leadData.consent ? 'Ja' : 'Nein'}
🔗 Source: ${leadData.source || 'direct'}
⏰ ${new Date(leadData.timestamp).toLocaleString('de-CH')}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });
        
        const result = await response.json();
        if (result.ok) {
            console.log('✅ Lead sent to Telegram successfully');
        } else {
            console.error('❌ Telegram API error:', result);
        }
    } catch (error) {
        console.error('❌ Error sending to Telegram:', error);
    }
}

function getEignungslevel(score) {
    if (score >= 12) {
        return {
            label: 'Solide Ausgangslage',
            description: 'Deine finanzielle Situation bietet eine solide Basis für ein Immobilieninvestment. Die wichtigsten Voraussetzungen sind erfüllt.',
            income: 'im relevanten Bereich', equity: 'einsetzbar', stability: 'stabil', timing: 'kurzfristig prüfbar'
        };
    } else if (score >= 8) {
        return {
            label: 'Prüfbar mit Klärung',
            description: 'Deine Ausgangslage ist interessant. Einige Punkte sollten wir kurz klären, um eine fundierte Einschätzung zu geben.',
            income: 'grundsätzlich relevant', equity: 'vorhanden', stability: 'gemischt', timing: 'mittelfristig'
        };
    } else {
        return {
            label: 'Aktuell eher nicht – aber planbar',
            description: 'Im Moment ist die Basis noch ausbaufähig. Das ist völlig normal – lass uns schauen, welche Schritte dich weiterbringen.',
            income: 'ausbaufähig', equity: 'im Aufbau', stability: 'noch im Aufbau', timing: 'langfristig'
        };
    }
}

function showFullResult(leadData) {
    const level = getEignungslevel(leadData.score);
    document.getElementById('quiz-questions').innerHTML = `
        <div class="quiz-question">
            <h3 style="text-align: center; color: var(--accent); margin-bottom: 32px;">
                Dein Ergebnis: ${level.label}
            </h3>
            <div style="background: var(--light-grey); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                <h4 style="color: var(--primary-blue); margin-bottom: 16px;">Deine Kurz-Einordnung</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;">📊 Einkommen: ${level.income}</li>
                    <li style="padding: 8px 0;">💰 Eigenkapital: ${level.equity}</li>
                    <li style="padding: 8px 0;">🏢 Stabilität: ${level.stability}</li>
                    <li style="padding: 8px 0;">📅 Timing: ${level.timing}</li>
                </ul>
            </div>
            <div style="margin-bottom: 32px;">
                <h4 style="color: var(--primary-blue); margin-bottom: 12px;">Was das praktisch bedeutet</h4>
                <p style="color: var(--secondary-grey); line-height: 1.8;">${level.description}</p>
            </div>
            <div style="text-align: center; padding: 32px 0; background: var(--light-grey); border-radius: 8px;">
                <h4 style="color: var(--primary-blue); margin-bottom: 16px;">
                    Möchtest du deine Situation kurz einordnen lassen?
                </h4>
                <p style="color: var(--secondary-grey); margin-bottom: 24px;">
                    Wir melden uns innerhalb von 24 Stunden bei dir.
                </p>
                <button class="cta-button" onclick="closeQuiz()">Verstanden</button>
            </div>
            <p style="text-align: center; font-size: 14px; color: var(--text-light); margin-top: 24px;">
                Dein Ergebnis wurde an ${leadData.email} gesendet.
            </p>
        </div>
    `;
}

function closeQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
    document.body.style.overflow = 'auto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveAnalytics() {
    localStorage.setItem('funnel_analytics', JSON.stringify(analytics));
}

function trackAnalyticsEvent(eventType, data = {}) {
    switch(eventType) {
        case 'view': analytics.views++; break;
        case 'quiz_start': analytics.quizStarts++; break;
        case 'quiz_complete': analytics.quizComplete++; break;
        case 'lead': analytics.leads++; analytics.leadsList.push(data); break;
    }
    saveAnalytics();
}

document.addEventListener('DOMContentLoaded', function() {
    trackEvent('ViewContent', { content_name: 'landing_page' });
    trackAnalyticsEvent('view');
});
