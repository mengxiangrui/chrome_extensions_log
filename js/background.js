(() => {
    // tools
    const storage = {
        get: (key) => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, value),
        remove: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear()
    };
    const getSwitchState = () => storage.get('switch');
    const setSwitchState = (value) => storage.set('switch', value);
    // switch 'on'|'off'
    const state = {
        switch: null
    };
    const triggerStateTextMap = {
        on: 'off',
        off: 'on'    
    }
    Object.defineProperty(state, 'switch', {
        get: () => this.switch,
        set: (newVal) => {
            setSwitchState(newVal);
            console.log('newVal:', newVal);
            this.switch = newVal;
        }
    });
    // init state
    const defineSwitchState = 'off';
    const switchState = getSwitchState();
    if (switchState === null) {
        // 第一次安装后运行
        state['switch'] = defineSwitchState;
    } else {
        state['switch'] = switchState;
    }
    // listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === 'getSwitchState') {
            sendResponse(getSwitchState());
        } else if (message === 'triggerSwitchState') {
            sendResponse(triggerStateTextMap[getSwitchState()]);
        }
    });
    // 展示Notification
    const show = () => {
        let time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
        let hour = time[1] % 12 || 12;               // The prettyprinted hour.
        let period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
        new Notification(hour + time[2] + ' ' + period, {
            icon: '48.png',
            body: 'Time to make the toast.'
        });
    }
    // 拦截打点请求
    chrome.webRequest.onBeforeRequest.addListener((details) => {
        
        console.info('details:', details);
        let url = details.url;
        let reg = new RegExp(/wgo.mmstat.com/);
        if (reg.test(url) && state.switch === 'on') {
            console.info('触发消息显示');
            show();
        }
    }, {
        urls: ['*://wgo.mmstat.com/*']
    }, ["blocking"]);
})();