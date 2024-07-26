const STORAGE_KEYS = {
  ICONS: 'icons',
  TEXT: 'text',
};

const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.ICONS]: true,
  [STORAGE_KEYS.TEXT]: true,
};

const SELECTORS = {
  CHECKBOX_INPUTS: 'input.cb',
  ICONS_CHECKBOX: 'input.gm_icons',
  TEXT_CHECKBOX: 'input.gm_text',
  STATUS_ELEMENT: 'p#status',
};

const MESSAGES = {
  SAVING: 'Saving...',
  SAVED: 'Settings saved. Please reload your Gmail website.',
};

const SAVE_DELAY = 2000;

function updateStatus(message) {
  document.querySelector(SELECTORS.STATUS_ELEMENT).textContent = message;
  document.querySelector(SELECTORS.STATUS_ELEMENT).style.display = "block";
}

function saveSettings() {
  updateStatus(MESSAGES.SAVING);

  const settings = {
    [STORAGE_KEYS.ICONS]: document.querySelector(SELECTORS.ICONS_CHECKBOX).checked,
    [STORAGE_KEYS.TEXT]: document.querySelector(SELECTORS.TEXT_CHECKBOX).checked,
  };

  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving settings:', chrome.runtime.lastError);
      updateStatus('Error saving settings. Please try again.');
      return;
    }
    setTimeout(() => updateStatus(MESSAGES.SAVED), SAVE_DELAY);
  });
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError);
      return;
    }
    document.querySelector(SELECTORS.ICONS_CHECKBOX).checked = items[STORAGE_KEYS.ICONS];
    document.querySelector(SELECTORS.TEXT_CHECKBOX).checked = items[STORAGE_KEYS.TEXT];
  });
}

function initializeEventListeners() {
  document.querySelectorAll(SELECTORS.CHECKBOX_INPUTS).forEach((checkbox) => {
    checkbox.addEventListener('change', saveSettings);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initializeEventListeners();
});
