if (!initialized()) {
  let files = Array.from(document.querySelectorAll('.js-file-content'));
  const totalFiles = +document.querySelector('#files_tab_counter').textContent;
  console.info(`Adding collapse buttons: ${files.length}/${totalFiles}`);

  files.forEach((file, index) => {
    const button = createButton(index + 1);
    file.appendChild(button);
  });

  if (files.length < totalFiles) {
    observe(files.length, totalFiles);
  }
}

function observe(startCount, totalFiles) {
  const list = document.querySelector('#files');
  const selector = '.js-file-content';
  let count = startCount;

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(file => {
        let fileContent;
        if (file.querySelector && (fileContent = file.querySelector(selector))) {
          fileContent.appendChild(createButton(++count));
          if (count == totalFiles) {
            observer.disconnect();
            console.info('Observer disconnected');
          }
        }
      })
    });
  });

  observer.observe(list, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

function collapseFile(target) {
  const file = target.srcElement.closest('.file');
  file.classList.toggle('Details--on');
  file.classList.toggle('open');
  file.scrollIntoView();
}

function createButton(index) {
  const button = document.createElement('span');
  button.innerHTML = svgContent();
  button.classList = ['collapse-icon'];
  button.title = 'Collapse file ' + index;
  button.style = 'position: absolute; bottom: 0; right: 10px; cursor: pointer;';
  button.addEventListener('click', collapseFile);
  return button;
}

// TODO: convert to png
function svgContent() {
  return `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg height="16px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="10px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M256,213.7L256,213.7L256,213.7l174.2,167.2c4.3,4.2,11.4,4.1,15.8-0.2l30.6-29.9c4.4-4.3,4.5-11.3,0.2-15.5L264.1,131.1  c-2.2-2.2-5.2-3.2-8.1-3c-3-0.1-5.9,0.9-8.1,3L35.2,335.3c-4.3,4.2-4.2,11.2,0.2,15.5L66,380.7c4.4,4.3,11.5,4.4,15.8,0.2L256,213.7  z"/></svg>`;
}

function initialized() {
  if (document.querySelector('#files') && !document.querySelector('#files').dataset.bottomCollapse) {
    document.querySelector("#files").dataset.bottomCollapse = true;
    return false;
  }
  return true;
}
