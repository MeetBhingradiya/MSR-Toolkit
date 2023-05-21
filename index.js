const port = chrome.runtime.connect();

const staticSearchesWrapper = document.getElementById('static-search-input-wrapper');
const randomSearchesWrapper = document.getElementById('random-search-input-wrapper');

const iterationCount1 = document.getElementById('iteration-count-1');
const iterationCount2 = document.getElementById('iteration-count-2');
const iterationCount3 = document.getElementById('iteration-count-3');
const iterationCountWrapper = document.getElementById('iteration-count-wrapper');

const DesktopWarp = document.getElementById('Desktop-Warp');
const MobileWarp = document.getElementById('Mobile-Warp');
const TotalWarp = document.getElementById('Total-Warp');

const ReedemEndpoint = '/Products/MSToolkit';
const UpdateEndpoint = '/Products/MSToolkit/Version';

const VER = 2.3;
const API = 'https://api.teamsm.live';


function setCountDisplayText({
    numIterations,
    overallCount,
    containsDesktop,
    containsMobile,
    desktopRemaining,
    mobileRemaining,
}) {
    if (numIterations === overallCount) {
        clearCountDisplayText();
        return;
    }
    iterationCountWrapper.style = 'display: block;';

    if (containsDesktop) {
        DesktopWarp.style.display = 'flex';
        iterationCount1.innerText = `${desktopRemaining}`;
    } else {
        DesktopWarp.style.display = 'none';
    }

    if (containsMobile) {
        MobileWarp.style.display = 'flex';
        iterationCount2.innerText = `${mobileRemaining}`;
    } else {
        MobileWarp.style.display = 'none';
    }

    if (containsDesktop && containsMobile) {
        iterationCount3.innerText = `${numIterations - overallCount}`;
    } else if (containsDesktop && !containsMobile) {
        iterationCount3.innerText = `${desktopRemaining}`;
    } else if (!containsDesktop && containsMobile) {
        iterationCount3.innerText = `${mobileRemaining}`;
    } else {
        iterationCount3.innerText = `${numIterations - overallCount}`;
    }

    if (!containsDesktop && !containsMobile) {
        iterationCount1.innerText = numIterations - overallCount;
    }
}

const Remove_Childrens = (Parent) => {
    while (Parent.firstChild) {
        Parent.removeChild(Parent.firstChild);
    }
}

function clearCountDisplayText() {
    iterationCount1.innerText = '';
    iterationCount2.innerText = '';
    iterationCount3.innerText = '';
    iterationCountWrapper.style = 'display: none;';
}

port.onMessage.addListener(msg => {
    switch (msg.type) {
        case constants.MESSAGE_TYPES.UPDATE_SEARCH_COUNTS: {
            setCountDisplayText(msg);
            break;
        }
        case constants.MESSAGE_TYPES.CLEAR_SEARCH_COUNTS: {
            clearCountDisplayText();
            break;
        }
        default: break;
    }
});

// ? Getting Search Count
chrome.runtime.sendMessage({
    type: constants.MESSAGE_TYPES.GET_SEARCH_COUNTS,
});

// ? Static Search and Random Search Menu Toggle
function updateSearchInputsVisibility() {
    if (document.getElementById('random-search').checked) {
        staticSearchesWrapper.style = 'display: none;';
        randomSearchesWrapper.style = 'display: block;';
    } else {
        staticSearchesWrapper.style = 'display: block;';
        randomSearchesWrapper.style = 'display: none;';
    }
}

const preferenceBindings = [
    { id: 'desktop-iterations', elementKey: 'value', preferenceKey: 'desktopIterations' },
    { id: 'mobile-iterations', elementKey: 'value', preferenceKey: 'mobileIterations' },
    { id: 'delay', elementKey: 'value', preferenceKey: 'delay' },
    { id: 'random-search-iterations-min', elementKey: 'value', preferenceKey: 'randomSearchIterationsMin' },
    { id: 'random-search-iterations-max', elementKey: 'value', preferenceKey: 'randomSearchIterationsMax' },
    { id: 'random-search-delay-min', elementKey: 'value', preferenceKey: 'randomSearchDelayMin' },
    { id: 'random-search-delay-max', elementKey: 'value', preferenceKey: 'randomSearchDelayMax' },
    { id: 'auto-click', elementKey: 'checked', preferenceKey: 'autoClick' },
    { id: 'random-guesses', elementKey: 'checked', preferenceKey: 'randomGuesses' },
    { id: 'platform-spoofing', elementKey: 'value', preferenceKey: 'platformSpoofing' },
    { id: 'random-search', elementKey: 'checked', preferenceKey: 'randomSearch' },
    { id: 'blitz-search', elementKey: 'checked', preferenceKey: 'blitzSearch' },
];

getStorage(
    preferenceBindings.map(({ id, elementKey, preferenceKey }) => ({
        key: preferenceKey,
        cb: value => {
            document.getElementById(id)[elementKey] = value === undefined
                ? constants.DEFAULT_PREFERENCES[preferenceKey]
                : value;
        },
    })),
).then(updateSearchInputsVisibility);

// ? Save Any Button Action
function saveChanges() {
    updateSearchInputsVisibility();
    const newPreferences = preferenceBindings.reduce((acc, binding) => ({
        ...acc,
        [binding.preferenceKey]: document.getElementById(binding.id)[binding.elementKey],
    }), {});
    setStorage(newPreferences);
}

// ? Reset Button Action
function reset(e) {
    e.preventDefault();
    if (document.getElementById('random-search').checked) {
        document.getElementById('random-search-iterations-min').value = constants.DEFAULT_PREFERENCES.randomSearchIterationsMin;
        document.getElementById('random-search-iterations-max').value = constants.DEFAULT_PREFERENCES.randomSearchIterationsMax;
        document.getElementById('random-search-delay-min').value = constants.DEFAULT_PREFERENCES.randomSearchDelayMin;
        document.getElementById('random-search-delay-max').value = constants.DEFAULT_PREFERENCES.randomSearchDelayMax;
    } else {
        document.getElementById('desktop-iterations').value = constants.DEFAULT_PREFERENCES.desktopIterations;
        document.getElementById('mobile-iterations').value = constants.DEFAULT_PREFERENCES.mobileIterations;
        document.getElementById('delay').value = constants.DEFAULT_PREFERENCES.delay;
    }
    saveChanges();
}

function openOptions(e) {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}

// ! Pro Plan Settings

function PlanChange() {
    function Update_Title() {
        if (localStorage.getItem('Beta') == 'true') {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Beta`;
        } else if (localStorage.getItem('Pro') == 'true') {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Pro`;
        } else {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Standard`;
        }
    }

    function ProFeatures() {
        if (localStorage.getItem('Pro') !== 'true') {
            localStorage.setItem('Pro', 'true');
        }

        document.body.style.height = "725px";

        // Static Search
        document.getElementById('Pro-Static-Delay').style.display = 'flex';
        document.getElementById('Pro-Static-Divide').style.display = 'flex';
        document.getElementById('Pro-Static-Mobile').style.display = 'flex';

        // Random Search
        document.getElementById('random-search').disabled = false;
        document.getElementById('random-search').checked = false;

        // Random Guesses
        document.getElementById('random-guesses').disabled = false;
        document.getElementById('random-guesses').checked = false;


        // Auto Click
        document.getElementById('auto-click').disabled = false;
        document.getElementById('auto-click').checked = true;

        // Device
        document.getElementById('Pro-Both').disabled = false;
        document.getElementById('Pro-Mobile').disabled = false;
        document.getElementById('Pro-Spoofing').disabled = false;

        // Advertisements
        document.getElementById('Pro-Coffee-Mikeyaworski').style = 'display: none;';
        document.getElementById('Pro-Github-Mikeyaworski').style = 'display: none;';
        document.getElementById('Pro-Github-MeetBhingradiya').style = 'display: none;';

        // Radio Selectors
        document.getElementById('Pro-Radio-Warp').style.display = 'flex';

        // Icon8
        document.getElementById('Icon8').style.marginLeft = '217px';

        // Warp
        document.getElementById('Total-Warp').style.display = 'flex';

        // Reset Button
        document.getElementById('reset').style.display = 'flex';

        // Pro Indicators
        document.getElementById('Downgrade').style.display = 'flex';
        document.getElementById('Upgrade').style.display = 'none';
        saveChanges();
    }

    function FreeFeatures() {
        // Credentials
        localStorage.removeItem('Pro');

        document.body.style.height = "520px";

        // Static Search
        document.getElementById('Pro-Static-Delay').style.display = 'none';
        document.getElementById('Pro-Static-Divide').style.display = 'none';
        document.getElementById('Pro-Static-Mobile').style.display = 'none';

        // Random Search
        document.getElementById('random-search').disabled = true;
        document.getElementById('random-search').checked = false;
        
        // Random Guesses
        document.getElementById('random-guesses').disabled = true;
        document.getElementById('random-guesses').checked = true;

        // Auto Click
        document.getElementById('auto-click').disabled = true;
        document.getElementById('auto-click').checked = false;

        // Device
        document.getElementById('Pro-Both').disabled = true;
        document.getElementById('Pro-Mobile').disabled = true;
        document.getElementById('Pro-Spoofing').disabled = true;

        // Advertisements
        document.getElementById('Pro-Coffee-Mikeyaworski').style = 'display: block;';
        document.getElementById('Pro-Github-Mikeyaworski').style = 'display: block;';
        document.getElementById('Pro-Github-MeetBhingradiya').style = 'display: block;';

        // Icon8 Margin
        document.getElementById('Icon8').style.marginLeft = '97px';

        // Radio Selectors
        document.getElementById('Pro-Radio-Warp').style.display = 'none';

        // Device
        document.getElementById('platform-spoofing').value = 'desktop-only';

        // Warp
        document.getElementById('Total-Warp').style.display = 'none';

        // Reset Button
        document.getElementById('reset').style.display = 'none';

        // Pro Indicators
        document.getElementById('Downgrade').style.display = 'none';
        document.getElementById('Upgrade').style.display = 'flex';
        saveChanges();
    }

    Update_Title();
    if (localStorage.getItem("Pro") === 'true') {
        ProFeatures();
    } else {
        FreeFeatures();
    }
}

async function UpgradeToPro() {
    if (localStorage.getItem("Pro") === 'true') {
        alert('You Already Have Pro Version');
        return;
    } else {
        var UserInputs = prompt('ENTER PROMOCODE', ' ');

        if (UserInputs === null) return;

        const body = JSON.stringify({
            PROMO: UserInputs,
            VER: VER,
        })

        try {
            var API = await fetch('https://api.teamsm.live/Products/MSToolkit', {
                method: 'POST',
                body,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            var Res = await API.json();

            if (Res.Status === 1) {
                localStorage.setItem('Pro', 'true');
                PlanChange();
                alert(Res?.Message);
            } else {
                localStorage.removeItem('Pro');
                PlanChange();
                alert(Res?.Message ? Res?.Message : Res.message);
            }
        } catch (error) {
            alert('Something Went Wrong While Connecting To Server !');
        }
    }
}

async function DowngradeToFree() {
    if (localStorage.getItem("Pro") !== null) {
        const Comfirm = confirm('Are you sure you want to Downgrade to Free version?');

        if (!Comfirm) {
            return;
        } else {
            localStorage.removeItem('Pro');
            PlanChange();
            alert('Downgraded to Free Version !');
        }
    } else {
        alert('You Already Have Free Version !');
        return;
    }
}

const changeBindings = [
    { id: 'desktop-iterations', eventType: 'input' },
    { id: 'mobile-iterations', eventType: 'input' },
    { id: 'delay', eventType: 'input' },
    { id: 'random-search', eventType: 'change' },
    { id: 'random-search-iterations-min', eventType: 'input' },
    { id: 'random-search-iterations-max', eventType: 'input' },
    { id: 'random-search-delay-min', eventType: 'input' },
    { id: 'random-search-delay-max', eventType: 'input' },
    { id: 'auto-click', eventType: 'change' },
    { id: 'random-guesses', eventType: 'change' },
    { id: 'platform-spoofing', eventType: 'change' },
    { id: 'blitz-search', eventType: 'change' },
    { id: 'reset', eventType: 'click', fn: reset },
    { id: 'open-options', eventType: 'click', fn: openOptions },
    { id: 'stop', eventType: 'click', fn: stopSearches },
    { id: 'Upgrade', eventType: 'click', fn: UpgradeToPro },
    { id: 'Downgrade', eventType: 'click', fn: DowngradeToFree },
];

changeBindings.forEach(({ id, eventType, fn = saveChanges }) => {
    document.getElementById(id).addEventListener(eventType, fn);
});

function startSearches() {
    port.postMessage({ type: constants.MESSAGE_TYPES.START_SEARCH });
    document.getElementById('search').style.display = 'none';
    document.getElementById('stop').style.display = 'flex';
}

function stopSearches() {
    port.postMessage({ type: constants.MESSAGE_TYPES.STOP_SEARCH });
    document.getElementById('search').style.display = 'none';
    document.getElementById('stop').style.display = 'none';
}

chrome.commands.onCommand.addListener(command => {
    if (command === 'start-searches') startSearches();
});
document.getElementById('search').addEventListener('click', startSearches);

document.getElementById('open-reward-tasks').addEventListener('click', async () => {
    function openRewardTasks() {
        return new Promise(resolve => {
            chrome.tabs.executeScript({
                file: '/content-scripts/open-reward-tasks.js',
            }, resolve);
        });
    }

    const tab = await getCurrentTab();
    if (tab && tab.url.includes(constants.REWARDS_URL)) {
        openRewardTasks();
    } else {
        chrome.tabs.update({
            url: constants.REWARDS_URL,
        }, () => {
            async function listener(updatedTabId, info, updatedTab) {
                if (tab.id === updatedTabId && info.status === 'complete' && updatedTab.url.includes(constants.REWARDS_URL)) {
                    await openRewardTasks();
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            }
            chrome.tabs.onUpdated.addListener(listener);
        });
    }
});

// ! Helpers
function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const useState = (defaultValue) => {
    let value = defaultValue;
    const getValue = () => value
    const setValue = newValue => value = newValue
    return [getValue, setValue];
}

// ! Version Control System
async function VersionControl() {
    try {
        var _API = `${API}${UpdateEndpoint}`
        const Data = await fetch(_API, {
            method: 'POST',
            body: JSON.stringify({
                VER,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const Res = await Data.json();
        if (Res.Status === 1) {
            localStorage.setItem('Version', VER);
            if (Res?.isBeta === true) {
                localStorage.setItem('Beta', 'true');
                alert('Warning: You are using Beta Version !');
            } else {
                localStorage.removeItem('Beta');
            }
            PlanChange();
        } else {
            alert(Res?.Message ? Res?.Message : Res.message);
            localStorage.removeItem('Version');
            PlanChange();
        }
    } catch (error) {
        alert('Something Went Wrong While Checking For Updates !');
    }
}

function Valid_RadioBtn(Value) {
    var DesktopRadio = document.getElementById('Radio-Desktop').checked;
    var MobileRadio = document.getElementById('Radio-Moblie').checked;
    var BothRadio = document.getElementById('Radio-Both').checked;
    var NoneRadio = document.getElementById('Radio-No-Spoofing').checked;

    if (localStorage.getItem('Pro') !== null) {
        if (Value === 'desktop-only') {
            DesktopRadio = true;
        } else if (Value === 'mobile-only') {
            MobileRadio = true;
        } else if (Value === 'desktop-and-mobile') {
            BothRadio = true;
        } else if (Value === 'none') {
            NoneRadio = true;
        } else {
            DesktopRadio = true;
        }
        return Value;
    } else {
        if (Value === 'desktop-only') {
            DesktopRadio = true;
        } else if (Value === 'mobile-only') {
            DesktopRadio = true;
        } else if (Value === 'desktop-and-mobile') {
            DesktopRadio = true;
        } else if (Value === 'none') {
            DesktopRadio = true;
        } else {
            DesktopRadio = true;
        }
        return 'desktop-only';
    }
}

function Update_RadioBtn() {
    document.getElementsByName("Device").forEach((e) => {
        e.addEventListener('click', async () => {
            var RadioBtns = document.getElementsByName('Device');
            var Value;
            for (var i = 0; i < RadioBtns.length; i++) {
                if (RadioBtns[i].checked) {
                    Value = RadioBtns[i].value;
                }
            }
            document.getElementById('platform-spoofing').value = Valid_RadioBtn(Value);
            saveChanges();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // VersionControl();
    Update_RadioBtn();
    PlanChange();
});