// 当前状态;
let currentSwitchState = null;
const stateTextMap = {
    on: '打开',
    off: '关闭'
};
const nextStateTextMap = {
    on: '关闭',
    off: '打开'    
};
const triggerStateTextMap = {
    on: 'off',
    off: 'on'    
}
console.info('chrome.runtime.sendMessage:', chrome.runtime.sendMessage);
// 拿到初始状态
chrome.runtime.sendMessage('getSwitchState', (response) => {
    console.info('response:', response);
    currentSwitchState = response;
    render();
});
// dom
const $cs = document.querySelector('.curret-state');
const $ns = document.querySelector('.next-state');
const $btn = document.querySelector('.btn');
// render
const render = () => {
    let currentStateText = stateTextMap[currentSwitchState];
    let nextStateText = nextStateTextMap[currentSwitchState];
    $cs.innerText = currentStateText;
    $ns.innerText = nextStateText;
};
// 
const triggerSwitchState = () => {
    console.info('trigger click');
    chrome.runtime.sendMessage('triggerSwitchState', (response) => {
        currentSwitchState = triggerStateTextMap[currentSwitchState];
    });
};
// event
$btn.addEventListener('click', (e) => {
    triggerSwitchState();
});
