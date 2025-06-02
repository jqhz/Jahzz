document.addEventListener('DOMContentLoaded', () => {
        // --- element refs ---
const outputEl    = document.getElementById('output');
const cmdInput    = document.getElementById('cmdline');
const terminalEl  = document.getElementById('terminal');
const asciiHeader = document.querySelector('.ascii-header');
const navLinks    = Array.from(document.querySelectorAll('.nav-item'));
const indicator   = document.querySelector('.nav-indicator');
const sections    = document.querySelectorAll('.page-section');

// --- helper funcs for nav/sections ---
function moveIndicator(el) {
    const { offsetLeft: x, offsetWidth: w } = el;
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.width     = `${w}px`;
}
function activateSection(id) {
    sections.forEach(sec => sec.classList.toggle('hidden', sec.id !== id));
}
function findLink(name) {
    return navLinks.find(l => l.getAttribute('href').slice(1) === name);
}

// --- CLI commands object ---
const commands = {
    help: () => [
    'Available commands:',
    'help      – show this list',
    'about     – display info',
    'clear     – clear terminal',
    'neofetch  – show ASCII header',
    'ls        – list sections',
    'cd <sec>  – switch to [home,about,projects,contact]',
    ].join('\n'),

    about: () => `I'm an interactive CLI demo built with HTML, CSS & JavaScript.`,

    clear: () => {
    outputEl.innerHTML = '';
    return '';
    },

    neofetch: () => {
    const clone = asciiHeader.cloneNode(true);
    outputEl.appendChild(clone);
    return '';
    },

    ls: () => 'home  about  projects  contact',

    cd: args => {
    const target = args[0];
    if (!target || !['home','about','projects','contact'].includes(target)) {
        return `Usage: cd [home|about|projects|contact]`;
    }
    // update navbar and sections just like a click
    navLinks.forEach(l => l.classList.remove('active'));
    const link = findLink(target);
    link.classList.add('active');
    moveIndicator(link);
    activateSection(target);
    return '';
    }
};

// --- handle CLI input ---
function handleCommand(input) {
    const [base, ...args] = input.trim().split(/\s+/);
    if (!base) return;
    if (commands[base]) return commands[base](args);
    return `Command not found: ${base}`;
}
cmdInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
    const cmd = cmdInput.value;
    // echo prompt
    const promptLine = document.createElement('div');
    promptLine.textContent = `> ${cmd}`;
    outputEl.appendChild(promptLine);
    // execute
    const result = handleCommand(cmd);
    if (result) {
        const resLine = document.createElement('div');
        resLine.textContent = result;
        outputEl.appendChild(resLine);
    }
    cmdInput.value = '';
    terminalEl.scrollTop = terminalEl.scrollHeight;
    }
});

// --- handle navbar clicks ---
navLinks.forEach(link => {
    link.addEventListener('click', e => {
    e.preventDefault();
    // clear CLI prompt focus
    cmdInput.blur();
    // update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    // move indicator & swap section
    const targetId = link.getAttribute('href').slice(1);
    moveIndicator(link);
    activateSection(targetId);
    });
});

// --- initialize state ---
const initial = document.querySelector('.nav-item.active');
moveIndicator(initial);
activateSection(initial.getAttribute('href').slice(1));
});
// **************=============================================================================

const floatingCli = document.getElementById('floating-cli');
const floatingCmd = document.getElementById('floating-cmdline');

// Toggle floating CLI with backslash key
window.addEventListener('keydown', (e) => {
  if (e.key === '\\') {
    e.preventDefault();
    floatingCli.classList.toggle('hidden');
    if (!floatingCli.classList.contains('hidden')) {
      floatingCmd.focus();
    } else {
      floatingCmd.blur();
    }
  }
});

floatingCmd.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const input = floatingCmd.value.trim();
    if (input.startsWith('cd ')) {
      const section = input.slice(3);
      const sectionIds = ['home', 'about', 'projects', 'contact'];
      if (sectionIds.includes(section)) {
        // Simulate navbar click
        const navLink = document.querySelector(`.nav-item[href="#${section}"]`);
        if (navLink) navLink.click();
      }
    }
    const sectionIds = ['home', 'about', 'projects', 'contact'];
    if (sectionIds.includes(input)) {
    // simulate navbar click as before, but using input directly
        const navLink = document.querySelector(`.nav-item[href="#${input}"]`);
        if (navLink) navLink.click();
    }
    floatingCmd.value = '';
    floatingCli.classList.add('hidden');
  } else if (e.key === 'Escape') {
    floatingCmd.value = '';
    floatingCli.classList.add('hidden');
  }
});