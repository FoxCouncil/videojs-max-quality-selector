function mouseEffect(s, e) {
  const header = document.getElementById('source-list').tHead.rows[0].cells[e.cellIndex];

  if (s) {
    header.classList.add('hover');
  } else {
    header.classList.remove('hover');
  }
}

function updateOptionsOutput() {
  const object = {};

  for (const property in window.tester.options) {
    if (window.tester.optionDefaults[property] !== window.tester.options[property]) {
      object[property] = window.tester.options[property];
    }
  }

  let outputText = JSON.stringify(object, null, '\t');

  if (outputText === '{}') {
    outputText = '';
  }

  document.getElementById('output').innerText = `var player = videojs('my-video');\nplayer.maxQualitySelector(${outputText});`;
}

function handleOptions(event) {
  const optionDetails = getOptionDetails(this);

  if (window.tester.options[optionDetails.name] === undefined) {
    window.tester.optionDefaults[optionDetails.name] = optionDetails.val;
  }

  if (optionDetails.type === 'bool') {
    const currentValue = optionDetails.val;
    const newValue = !currentValue;

    this.classList.remove(currentValue.toString());
    this.classList.add(newValue.toString());

    this.innerText = newValue.toString();

    window.tester.options[optionDetails.name] = newValue;

    // EXAMPLE: Using Plugin Here
    window.maxQualitySelector.options[optionDetails.name] = newValue;
    window.maxQualitySelector.update();
  } else if (optionDetails.type === 'enum') {
    const currentValue = optionDetails.val;
    let newValue = currentValue + 1;

    if (newValue >= optionDetails.enumData.length) {
      newValue = 0;
    }
    this.innerText = optionDetails.enumData[newValue];

    window.tester.options[optionDetails.name] = newValue;

    // EXAMPLE: Using Plugin Here
    window.maxQualitySelector.options[optionDetails.name] = newValue;
    window.maxQualitySelector.update();
  } else {
    // TODO: Support more options than just bool!
    console.log(optionDetails.type, optionDetails.name);
  }

  updateOptionsOutput();
}

function getOptionDetails(el) {
  const type = el.dataset.type;
  const name = el.dataset.name;
  let val;

  if (type === 'bool') {
    val = el.innerText === 'true' ? true : false;

    return { name, type, val };
  } else if (type === 'enum') {
    const enumData = JSON.parse(el.dataset.enum);

    val = enumData.indexOf(el.innerText);

    return { name, type, val, enumData };
  }

  return { name, type };
}

function changeSource() {
  let selectedEl;

  if (this === window) {
    window.tester.index = 0;
    selectedEl = document.querySelector('[data-id="0"]');
  } else {
    selectedEl = this;
    window.tester.index = parseInt(selectedEl.dataset.id);
  }

  document.querySelectorAll('.sourceButton').forEach(function(el, idx) {
    el.classList.remove('active');
  });

  document.querySelectorAll('#source-list th').forEach(function(el, idx) {
    el.classList.remove('active');
  });

  selectedEl.classList.add('active');

  const li = window.tester.sourcesEl[window.tester.index];
  const cellIdx = li.parentElement.parentElement.cellIndex;

  document.getElementById('source-list').tHead.rows[0].cells[cellIdx].classList.add('active');

  window.player.src(JSON.parse(selectedEl.dataset.urls));
}

function createSource(source) {
  const sourceId = window.tester.sources.length;
  const newEl = videojs.dom.createEl('li');

  newEl.appendChild(videojs.dom.createEl('a', { onclick: changeSource }, { 'href': '#', 'class': 'sourceButton', 'data-id': sourceId, 'data-urls': JSON.stringify(source.sources) }, source.name));
  window.tester.sources.push(source);
  window.tester.sourcesEl.push(newEl);
  return newEl;
}

async function startTestPage() {
  const self = window.tester = {};

  const progressiveEl = self.progressiveEl = document.getElementById('progressive');
  const adaptiveEl = self.adaptiveEl = document.getElementById('adaptive');
  const liveEl = self.liveEl = document.getElementById('live');

  progressiveEl.innerHTML = adaptiveEl.innerHTML = liveEl.innerHTML = '';

  const response = await fetch('index.json');

  self.config = await response.json();

  const urls = self.config.urls;

  self.sources = [];
  self.sourcesEl = [];

  // Progressive
  urls.progressive.forEach(function(source, index) {
    const newEl = createSource(source);

    progressiveEl.appendChild(newEl);
  });

  // Adaptive
  urls.adaptive.forEach(function(source, index) {
    const newEl = createSource(source);

    adaptiveEl.appendChild(newEl);
  });

  // Live
  urls.live.forEach(function(source, index) {
    const newEl = createSource(source);

    liveEl.appendChild(newEl);
  });

  self.options = {};
  self.optionDefaults = {};

  document.querySelectorAll('.options-button').forEach(function(obj, idx) {
    obj.addEventListener('click', handleOptions.bind(obj));
  });
}

(async function(window, videojs) {
  await startTestPage();

  window.player = videojs('videojs-max-quality-selector-player');
  window.qualityLevels = window.player.qualityLevels();
  window.maxQualitySelector = window.player.maxQualitySelector({
    /*labels: [ 'High', 'Low' ] -or- {
      0: 'High',
      8: 'Medium',
      16: 'Low',
      24: 'Super Low'
    }*/
  });

  document.getElementById('videojsVer').innerText = videojs.VERSION;
  document.getElementById('pluginVer').innerText = window.maxQualitySelector.__proto__.constructor.VERSION;
  document.getElementById('qlVer').innerText = window.player.qualityLevels.VERSION;

  changeSource();
  updateOptionsOutput();
}(window, window.videojs));
