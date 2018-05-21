if (!initialized()) {
  let files = Array.from(document.querySelectorAll('.js-file-content'));
  const totalFiles = +document.querySelector('#files_tab_counter').textContent;

  console.info(`Adding collapse buttons: ${files.length}/${totalFiles}`);

  files.forEach(appendButton);

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
          appendButton(fileContent, count++);
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

function appendButton(file, index) {
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('images/if_icon-chevron-up_211648.png');
  img.classList = ['collapse-icon'];
  img.title = 'Collapse file ' + (index + 1);
  img.style = 'position: absolute; bottom: 6px; right: 10px; width: 10px; cursor: pointer;';
  img.addEventListener('click', collapseFile);
  file.appendChild(img);
}

function initialized() {
  if (document.querySelector('#files') && !document.querySelector('#files').dataset.bottomCollapse) {
    document.querySelector("#files").dataset.bottomCollapse = true;
    return false;
  }
  return true;
}
