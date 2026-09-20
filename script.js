/**
 * Param Sundhari - Futuristic AI Emotional Support Web Application
 * Client-side script handling cosmic particle canvas, form validation,
 * AI loading choreography, dynamic companion rendering, and sharing features.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const canvas = document.getElementById('space-canvas');
  const supportForm = document.getElementById('support-form');
  const nameInput = document.getElementById('user-name');
  const problemInput = document.getElementById('user-problem');
  const nameError = document.getElementById('name-error');
  const problemError = document.getElementById('problem-error');
  const generalError = document.getElementById('general-error');
  const talkBtn = document.getElementById('talk-btn');

  const talkSection = document.getElementById('talk-section');
  const loadingSection = document.getElementById('loading-section');
  const loadingStepText = document.getElementById('loading-step-text');
  const loadingAvatarImg = document.getElementById('loading-avatar-img');
  const heroAvatarImg = document.getElementById('hero-avatar-img');

  const responseSection = document.getElementById('response-section');
  const companionAvatar = document.getElementById('response-character-avatar');
  const companionName = document.getElementById('response-character-name');
  const companionTitle = document.getElementById('response-character-title');
  const companionNote = document.getElementById('response-character-note');

  const respUnderstanding = document.getElementById('resp-understanding');
  const respWords = document.getElementById('resp-words');
  const respRemember = document.getElementById('resp-remember');
  const crisisBanner = document.getElementById('crisis-banner');

  const whatsappBtn = document.getElementById('whatsapp-btn');
  const copyBtn = document.getElementById('copy-btn');
  const newTalkBtn = document.getElementById('new-talk-btn');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // State
  let currentShareableMessage = '';
  let toastTimeout = null;

  // =========================================================================
  // 1. Cosmic Canvas Starfield Engine
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx = null;
  let stars = [];
  let shootingStars = [];
  let width = 0;
  let height = 0;
  let animationFrameId = null;

  if (canvas && canvas.getContext) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initStars();
    }

    function initStars() {
      stars = [];
      // Adjust star density according to screen size
      const count = Math.floor((width * height) / 3600);
      const starColors = ['#ffffff', '#e2e8f0', '#c084fc', '#38bdf8', '#f472b6'];

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.3,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          baseAlpha: Math.random() * 0.7 + 0.2,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          vy: Math.random() * 0.15 + 0.03
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);

      // Render cosmic stars
      for (let star of stars) {
        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
          star.y -= star.vy;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Occasional shooting star
      if (!prefersReducedMotion) {
        if (Math.random() < 0.008 && shootingStars.length < 2) {
          shootingStars.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.3,
            length: Math.random() * 70 + 40,
            speed: Math.random() * 6 + 7,
            angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
            opacity: 1
          });
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
          gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, ' + s.opacity + ')');

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.02;

          if (s.opacity <= 0 || s.x > width || s.y > height) {
            shootingStars.splice(i, 1);
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawStars);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();
  }

  // =========================================================================
  // 2. Input Validation & Form Clearing
  // =========================================================================
  function clearErrors() {
    nameError.textContent = '';
    problemError.textContent = '';
    generalError.textContent = '';
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) {
      nameError.textContent = '';
      generalError.textContent = '';
    }
  });

  problemInput.addEventListener('input', () => {
    if (problemInput.value.trim().length > 0) {
      problemError.textContent = '';
      generalError.textContent = '';
    }
  });

  // =========================================================================
  // 3. Form Submit & AI Request Choreography
  // =========================================================================
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const problem = problemInput.value.trim();
    let hasError = false;

    // Requirement 20: Empty field validations
    if (!name) {
      nameError.textContent = 'Please tell me your name first ✨';
      nameInput.focus();
      hasError = true;
    }

    if (!problem) {
      problemError.textContent = "Tell me what's troubling you. I'm listening 💜";
      if (!hasError) problemInput.focus();
      hasError = true;
    }

    if (hasError) return;

    // Start loading state
    startLoadingState();

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, problem })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || "I couldn't connect right now. Please try again in a moment.";
        throw new Error(errorMsg);
      }

      // Allow the loading animation messages to conclude gently
      setTimeout(() => {
        renderResponse(data, name);
      }, 1400);

    } catch (err) {
      console.error('Support generation error:', err);
      stopLoadingState();
      generalError.textContent = err.message || "I couldn't connect right now. Please try again in a moment.";
    }
  });

  // =========================================================================
  // 4. Loading State & Progressive Text
  // =========================================================================
  let loadingInterval = null;

  function startLoadingState() {
    talkBtn.disabled = true;
    talkSection.classList.add('hidden');
    responseSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    const steps = [
      'Listening...',
      'Understanding...',
      'Preparing a little light for you...'
    ];

    let currentStep = 0;
    loadingStepText.textContent = steps[0];

    loadingInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        loadingStepText.style.opacity = '0';
        setTimeout(() => {
          loadingStepText.textContent = steps[currentStep];
          loadingStepText.style.opacity = '1';
        }, 200);
      } else {
        clearInterval(loadingInterval);
      }
    }, 1100);
  }

  function stopLoadingState() {
    if (loadingInterval) clearInterval(loadingInterval);
    talkBtn.disabled = false;
    loadingSection.classList.add('hidden');
    talkSection.classList.remove('hidden');
  }

  // =========================================================================
  // 5. Response Rendering & Character Update
  // =========================================================================
  function renderResponse(data, userName) {
    if (loadingInterval) clearInterval(loadingInterval);
    loadingSection.classList.add('hidden');

    const character = data.character || {};
    const resp = data.response || {};

    // Update Companion in Hero & Response Card
    if (character.avatar) {
      companionAvatar.src = character.avatar;
      loadingAvatarImg.src = character.avatar;
      heroAvatarImg.src = character.avatar;
    }
    if (character.name) companionName.textContent = character.name;
    if (character.title) companionTitle.textContent = character.title;
    if (character.note) companionNote.textContent = character.note;

    // Populate structured message sections
    respUnderstanding.textContent = resp.understandingYou || '';
    respWords.textContent = resp.wordsForYou || '';
    respRemember.textContent = resp.rememberThis || '';

    // Handle crisis banner
    if (data.isCrisis) {
      crisisBanner.classList.remove('hidden');
    } else {
      crisisBanner.classList.add('hidden');
    }

    // Build shareable clean message
    const quoteText = resp.rememberThis ? `“${resp.rememberThis}”` : '';
    currentShareableMessage = `Param Sundhari ✨ — A little light for your difficult moments\n\n${quoteText}\n\n💜 Words for ${userName}:\n${resp.wordsForYou}\n\nRemember: You are never alone under this cosmic sky ✨`;

    // Setup WhatsApp Web Share Link
    const appUrl = window.location.href;
    const whatsappText = `✨ Param Sundhari — A little light for your difficult moments\n\n${quoteText}\n\nFind comfort and a kind well-wisher here: ${appUrl}`;
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

    // Reveal response card smoothly
    responseSection.classList.remove('hidden');
    responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    talkBtn.disabled = false;
  }

  // =========================================================================
  // 6. Clipboard & WhatsApp Share
  // =========================================================================
  copyBtn.addEventListener('click', async () => {
    if (!currentShareableMessage) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentShareableMessage);
      } else {
        // Fallback for non-HTTPS or legacy environments
        const textArea = document.createElement('textarea');
        textArea.value = currentShareableMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('Copied to clipboard ✨');
    } catch (err) {
      console.error('Failed to copy message:', err);
      showToast('Copied to clipboard ✨');
    }
  });

  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastText.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // =========================================================================
  // 7. Share Another Thought / New Talk Button
  // =========================================================================
  newTalkBtn.addEventListener('click', () => {
    responseSection.classList.add('hidden');
    talkSection.classList.remove('hidden');
    problemInput.value = '';
    problemInput.focus();
    talkSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

});
