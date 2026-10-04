// ===========================
//  BIRTHDAY FOR MEMEI
//  script.js
// ===========================

// --- CHAPTER DATA ---
var chapters = [
  {
    label: '01 / 04',
    html: '<p>happy birthday, meii!</p><p>selamat bertambah usia untuk manusia yang selalu punya cerita, celotehan, dan cara tersendiri buat bikin suasana jadi lebih ramai.</p><p>semoga di usia yang baru ini, makin banyak hal baik yang datang, makin banyak cerita seru yang bisa dibawa pulang, dan makin banyak hal yang bikin kamu bangga sama diri sendiri.</p>'
  },
  {
    label: '02 / 04',
    html: '<p>semoga semua hal yang lagi kamu usahakan pelan-pelan menemukan jalannya.</p><p>kalau nanti ada hari yang melelahkan, semoga kamu tetap punya tempat buat istirahat, orang-orang baik buat berbagi cerita, dan alasan kecil buat kembali tersenyum.</p><p>jangan lupa menikmati prosesnya juga, ya. hidup bukan cuma soal seberapa cepat sampai, tapi juga cerita-cerita random yang terjadi sepanjang perjalanan.</p>'
  },
  {
    label: '03 / 04',
    html: '<p>oh iya, makasih juga sudah ikut meramaikan hari-hari belakangan ini.</p><p>dari obrolan random, candaan yang kadang gak ada habisnya, sampai kejadian spontan yang akhirnya jadi bahan ketawaan lagi.</p><p>semoga kamu gak kehilangan sisi ceria dan kebiasaanmu bercerita.</p>'
  },
  {
    label: '04 / 04',
    html: '<p>sekali lagi, selamat ulang tahun, meii!</p><p>semoga tahun ini membawa lebih banyak kesempatan baru, pengalaman menyenangkan, dan pencapaian yang bikin kamu tersenyum bangga.</p><p>tetap jadi Kumeilla yang penuh cerita. jangan terlalu keras sama diri sendiri, dan jangan lupa kasih ruang buat menikmati hal-hal kecil.</p><p>enjoy your new chapter!</p>'
  }
];

// --- CHAT DATA ---
var chatData = {
  martin: [
    'hey, Memei! happy birthday!',
    'hope your day is full of good music, good laughs, and people who make you feel appreciated.',
    'enjoy every little moment today!'
  ],
  niki: [
    'happy birthday, Memei!',
    'hope this year brings you exciting experiences, new memories, and plenty of reasons to smile.',
    'have fun and keep being yourself!'
  ]
};

// --- STATE ---
var currentChapter = 0;
var chatRevealed   = { martin: false, niki: false };
var fallingStarted = false;

// ========================
//  CHAPTER SYSTEM
// ========================
function renderChapter(animate) {
  var ch      = chapters[currentChapter];
  var content = document.getElementById('chapterContent');
  var label   = document.getElementById('progressLabel');
  var fill    = document.getElementById('progressFill');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var clue    = document.getElementById('clueSection');
  var isLast  = currentChapter === chapters.length - 1;

  function applyRender() {
    content.innerHTML = ch.html;
    label.textContent = ch.label;
    fill.style.width  = ((currentChapter + 1) / chapters.length * 100) + '%';
    btnPrev.style.visibility = currentChapter === 0 ? 'hidden' : 'visible';

    if (isLast) {
      // Final chapter: hide nav button, show clue section inline below the letter
      btnNext.style.display = 'none';
      if (clue) clue.style.display = 'block';
    } else {
      btnNext.textContent   = 'lanjut \u2192';
      btnNext.style.display = 'inline-block';
      if (clue) clue.style.display = 'none';
    }
  }

  if (animate) {
    content.classList.add('chapter-fade-out');
    setTimeout(function() {
      applyRender();
      content.classList.remove('chapter-fade-out');
    }, 220);
  } else {
    applyRender();
  }
}

function nextChapter() {
  // btnNext is hidden on the last chapter, so this only runs on chapters 01–03
  if (currentChapter < chapters.length - 1) {
    currentChapter++;
    renderChapter(true);
  }
}

function prevChapter() {
  if (currentChapter > 0) {
    currentChapter--;
    renderChapter(true);
  }
}

// ========================
//  CHAT REVEAL
// ========================
function revealChat(id) {
  if (chatRevealed[id]) return;
  chatRevealed[id] = true;

  var capId = id.charAt(0).toUpperCase() + id.slice(1);
  var btn   = document.getElementById('btn' + capId);
  if (btn) btn.style.display = 'none';

  var container = document.getElementById(id + 'Bubbles');
  if (!container) return;

  var bubbles = chatData[id];
  var delay   = 100;

  bubbles.forEach(function(text, i) {
    var typingId = 'typing-' + id + '-' + i;

    // Show typing indicator
    setTimeout(function() {
      var typing = document.createElement('div');
      typing.className = 'typing-indicator';
      typing.id = typingId;
      typing.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(typing);
    }, delay);

    delay += 1100;

    // Replace with bubble
    setTimeout(function(capturedText, capturedTypingId) {
      return function() {
        var t = document.getElementById(capturedTypingId);
        if (t) t.remove();
        var bubble = document.createElement('div');
        bubble.className = 'bubble bubble-incoming';
        bubble.textContent = capturedText;
        container.appendChild(bubble);
      };
    }(text, typingId), delay);

    delay += 500;
  });

  // After last bubble is rendered, check if both greetings are complete
  setTimeout(function() {
    checkBothRevealed();
  }, delay);
}

// Reveal closing section once both idol greetings have been opened
function checkBothRevealed() {
  if (!chatRevealed.martin || !chatRevealed.niki) return;
  var closing = document.getElementById('closingSection');
  if (closing && closing.style.display === 'none') {
    closing.style.display = 'block';
    // Trigger CSS fade-in on next frame
    requestAnimationFrame(function() {
      closing.classList.add('closing-visible');
    });
    // Gentle scroll so the closing section comes into view
    setTimeout(function() {
      closing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}

// ========================
//  NEW SURPRISE REVEAL & CONTROLS
// ========================
function triggerReveal() {
  // Hide the entire letter + clue view as one unit
  var letterView = document.getElementById('letterView');
  if (letterView) letterView.style.display = 'none';

  // Show the gift transition animation
  var transition = document.getElementById('revealTransition');
  if (transition) transition.style.display = 'block';

  setTimeout(function() {
    if (transition) transition.style.display = 'none';
    var idolSec = document.getElementById('idolSection');
    if (idolSec) {
      idolSec.style.display = 'block';
      // Scroll to top of card so idol section is immediately visible
      var cardBox = idolSec.closest('.card-box') || idolSec;
      cardBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 2000);
}

function backToLetter() {
  // Hide idol section
  var idolSec = document.getElementById('idolSection');
  if (idolSec) idolSec.style.display = 'none';

  // Reset closing section for a fresh experience if user returns
  var closing = document.getElementById('closingSection');
  if (closing) {
    closing.style.display = 'none';
    closing.classList.remove('closing-visible');
  }

  // Restore the letter view at chapter 04 (where the user left off)
  var letterView = document.getElementById('letterView');
  if (letterView) letterView.style.display = 'block';

  // Re-render chapter 04 so clue section is shown correctly
  currentChapter = chapters.length - 1;
  renderChapter(false);

  // Scroll back to top of card
  var cardBox = letterView.closest('.card-box') || letterView;
  cardBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}



// ========================
//  EASTER EGG
// ========================
function openEasterEgg() {
  document.getElementById('easterModal').classList.add('open');
  document.getElementById('easterBackdrop').classList.add('open');
}

function closeEasterEgg() {
  document.getElementById('easterModal').classList.remove('open');
  document.getElementById('easterBackdrop').classList.remove('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeEasterEgg();
});

// ========================
//  PAGE NAVIGATION
// ========================
function goToPage(pageNum) {
  var pages = document.querySelectorAll('.page');
  pages.forEach(function(p) { p.classList.remove('active'); });

  var next = document.getElementById('page' + pageNum);
  if (next) next.classList.add('active');

  if (pageNum === 3) {
    currentChapter = 0;
    renderChapter(false);

    var music = document.getElementById('bg-music');
    if (music) {
      music.muted = false;
      music.play().catch(function() {});
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#4E7658', '#8EA893', '#F7D6DB', '#E89BB0', '#DCE8D8']
    });

    startFallingSymbols();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// ========================
//  FALLING SYMBOLS (restrained)
// ========================
function startFallingSymbols() {
  if (fallingStarted) return;
  fallingStarted = true;
  var symbols = ['\uD83C\uDF82', '\u2728'];
  setInterval(function() {
    var el = document.createElement('div');
    el.classList.add('falling');
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left            = (Math.random() * 88 + 6) + 'vw';
    el.style.animationDuration = (5 + Math.random() * 3) + 's';
    el.style.fontSize        = (16 + Math.random() * 8) + 'px';
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 8500);
  }, 1400);
}