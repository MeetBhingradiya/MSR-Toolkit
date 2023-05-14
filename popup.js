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

const Version = 2.2;
const API = 'https://api.teamsm.live';
const ReedemEndpoint = '/Products/MSToolkit';
const UpdateEndpoint = '/Products/MSToolkit/Version';

// if we are spoofing desktop searches, show a count labelled 'desktop'. same for mobile.
// if we are not spoofing anything, then just display an unlabelled count.
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
        // const el = containsDesktop ? iterationCount2 : iterationCount1;
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
chrome.runtime.sendMessage({
    type: constants.MESSAGE_TYPES.GET_SEARCH_COUNTS,
});

function updateSearchInputsVisibility() {
    if (document.getElementById('random-search').checked) {
        staticSearchesWrapper.style = 'display: none;';
        randomSearchesWrapper.style = 'display: block;';
    } else {
        staticSearchesWrapper.style = 'display: block;';
        randomSearchesWrapper.style = 'display: none;';
    }
}

// id is HTML id attribute
// elementKey is how to get the value of that element (depends on type of input)
// preferenceKey the is key in chrome storage and constants.DEFAULT_PREFERENCES
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
            // value could be false, in which case the shortcut || operator
            // would evaluate to the default (not intended)
            document.getElementById(id)[elementKey] = value === undefined
                ? constants.DEFAULT_PREFERENCES[preferenceKey]
                : value;
        },
    })),
).then(updateSearchInputsVisibility);

function saveChanges() {
    updateSearchInputsVisibility();
    const newPreferences = preferenceBindings.reduce((acc, binding) => ({
        ...acc,
        [binding.preferenceKey]: document.getElementById(binding.id)[binding.elementKey],
    }), {});
    setStorage(newPreferences);
}

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
        window.open(chrome.runtime.getURL('options.html')); z
    }
}

function PlanChange() {
    function ProFeatures() {
        // Credentials
        localStorage.setItem('Pro', 'true');

        // Title
        document.getElementById('Pro-ID').innerHTML = 'v2.2 Pro';

        // Random Search
        document.getElementById('random-search').disabled = false;

        // Random Guesses
        document.getElementById('random-guesses').disabled = false;

        // Auto Click
        document.getElementById('auto-click').disabled = false;

        // Device
        document.getElementById('Pro-Both').disabled = false;
        document.getElementById('Pro-Mobile').disabled = false;
        document.getElementById('Pro-Spoofing').disabled = false;

        // Advertisements
        document.getElementById('Pro-Coffee-Mikeyaworski').style = 'display: none;';
        document.getElementById('Pro-Github-Mikeyaworski').style = 'display: none;';
        document.getElementById('Pro-Github-MeetBhingradiya').style = 'display: none;';

        // Icon8
        document.getElementById('Icon8').style.marginLeft = '217px';

        // Warp
        document.getElementById('Total-Warp').style.display = 'flex';

        // Pro Indicators
        document.getElementById('Downgrade').style.display = 'flex';
        document.getElementById('Upgrade').style.display = 'none';
    }

    function FreeFeatures() {
        // Credentials
        localStorage.removeItem('Pro');

        // Title
        document.getElementById('Pro-ID').innerHTML = 'v2.2 Free';

        document.getElementById('random-search').disabled = true;

        // Random Guesses
        document.getElementById('random-guesses').disabled = true;

        // Auto Click
        document.getElementById('auto-click').disabled = true;

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

        // Warp
        document.getElementById('Total-Warp').style.display = 'none';

        // Pro Indicators
        document.getElementById('Downgrade').style.display = 'none';
        document.getElementById('Upgrade').style.display = 'flex';
    }

    if (localStorage.getItem("Pro") === 'true') {
        ProFeatures();
    } else {
        FreeFeatures();
    }
}


function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
            VER: Version,
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
        const Comfirm = confirm('Are you sure you want to downgrade to Free version?');
        if (!Comfirm) return;
        
        if (!Comfirm) {
            return;
        } else {
            localStorage.removeItem('Pro');
            PlanChange();
            alert('Downgraded to Free version');
        }
    } else {
        alert('You Already Have Free Version');
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
    { id: 'Downgrade', eventType: 'click', fn: DowngradeToFree },
    { id: 'Upgrade', eventType: 'click', fn: UpgradeToPro },
];

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('reset').click();
    PlanChange();
    (async () => {
        var RadioBtns = document.getElementsByName('Device');
        var Value;
        for (var i = 0; i < RadioBtns.length; i++) {
            if (RadioBtns[i].checked) {
                Value = RadioBtns[i].value;
            }
        }
        document.getElementById('platform-spoofing').value = Value;
        var event = new Event('change');
        document.getElementById('platform-spoofing').dispatchEvent(event);
    })();
    (async () => {
        try {
            var _API = `${API}${UpdateEndpoint}`
            const Data = await fetch(_API, {
                method: 'POST',
                body: JSON.stringify({
                    Version,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const Res = await Data.json();
    
            if (Res.Status === 1) {
            } else {
                alert(Res?.Message ? Res?.Message : Res.message);
            }
        } catch (error) {
            alert('Something Went Wrong While Connecting To Server !');
        }
    })()
});

document.getElementsByName("Device").forEach((e)=>{
    e.addEventListener('click', async () => {
        var RadioBtns = document.getElementsByName('Device');
        var Value;
        for (var i = 0; i < RadioBtns.length; i++) {
            if (RadioBtns[i].checked) {
                Value = RadioBtns[i].value;
            }
        }
        document.getElementById('platform-spoofing').value = Value;
        var event = new Event('change');
        document.getElementById('platform-spoofing').dispatchEvent(event);
    });
})


changeBindings.forEach(({ id, eventType, fn = saveChanges }) => {
    document.getElementById(id).addEventListener(eventType, fn);
});

function startSearches() {
    port.postMessage({ type: constants.MESSAGE_TYPES.START_SEARCH });
}

function stopSearches() {
    port.postMessage({ type: constants.MESSAGE_TYPES.STOP_SEARCH });
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