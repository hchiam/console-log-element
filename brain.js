document.body.style.background = "blue";
console.log('Hi! The demo is working.');
alert('Hi! The demo is working.');

function onError(error) {
  console.log(error);
}

// clearStorage();
initializeStorage();
addToStorage('test key', 'some data');
updateStorage('test key', 'updated data');
setTimeout(function() {
  getStorage(); // delay to let storage update
}, 100);

function initializeStorage() {
  browser.storage.local.get(null).then((results) => {
    console.log('initializeStorage', results);
  }, onError);
}

function getStorage() {
  browser.storage.local.get(null).then((results) => {
    console.log('getStorage', results);
  }, onError);
}

function addToStorage(key, data) {
  browser.storage.local.set({ [key] :  data }).then(() => {
    console.log('addToStorage', key, data);
  }, onError);
}

function updateStorage(key, data) {
  browser.storage.local.get(key).then((result) => {
    browser.storage.local.remove(key);
    addToStorage(key, data);
    console.log('updateStorage', key, data);
  }, onError);
}

function clearStorage() {
  browser.storage.local.clear();
  console.log('clearStorage');
}
