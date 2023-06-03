const port = chrome.runtime.connect();

// ! CONSTANTS [Working in v2.5]
const staticSearchesWrapper = document.getElementById('static-search-input-wrapper');
const randomSearchesWrapper = document.getElementById('random-search-input-wrapper');

const iterationCount1 = document.getElementById('iteration-count-1');
const iterationCount2 = document.getElementById('iteration-count-2');
const iterationCount3 = document.getElementById('iteration-count-3');
const iterationCountWrapper = document.getElementById('iteration-count-wrapper');

const DesktopWarp = document.getElementById('Desktop-Warp');
const MobileWarp = document.getElementById('Mobile-Warp');
const TotalWarp = document.getElementById('Total-Warp');

const ReedemEndpoint = '/Products/MSRToolkit';
const UpdateEndpoint = '/Products/MSRToolkit/Version';

const VER = 2.5;
// const API = 'https://api.teamsm.live';

const API = 'http://localhost:2003';

// ! WARP END



// @ OLD Auto Bing Search [ABS Script] - Modified by @TeamSM/MeetBhingradiya

// ? Update Search Counts
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

// ? Clear Search Counts
function clearCountDisplayText() {
    iterationCount1.innerText = '';
    iterationCount2.innerText = '';
    iterationCount3.innerText = '';
    iterationCountWrapper.style = 'display: none;';
}

// ? Message Listener
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

// ? GET Default Preferences from Config
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
    // { id: 'new-select', elementKey: 'checked', preferenceKey: 'useNewSelectiors' },
];

// ? Set Default Preferences
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

// @ WARP END


// @ Extra Features

// function ToggleSelect() {
//     var chaked  = document.getElementById('new-select').checked;
//     if (chaked == true) {
//         document.getElementsByName('Device').forEach(function (el) {
//             el.style.display = 'flex';
//         });
//         document.getElementById('platform-spoofing').style.display = 'none';
//     } else {
//         document.getElementsByName('Device').forEach(function (el) {
//             el.style.display = 'none';
//         });
//         document.getElementById('platform-spoofing').style.display = 'flex';
//     }
// }

// @ WARP END

// function LinkSettings(e) {
//     window.open(chrome.runtime.getURL('Settings.html'));
// }

// ! Pro Plan Settings [Working in v2.4]

function PlanChange() {
    function Update_Title() {
        if (localStorage.getItem('Beta') == 'true') {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Beta`;
        } else if (localStorage.getItem('Pro') == 'true') {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Pro`;
        } else {
            document.getElementById('Pro-ID').innerHTML = `v${VER} Free`;
        }
    }

    function ProFeatures() {
        // ? Credentials
        // ? Static Search
        // ? Random Search
        // ? Device Selectors
        // ? Advertisements
        // ? Control Panel
        // document.getElementById('Pro-disable-alerts').checked = true;
        // ? Update All Changes INTO Storage

        // ! OLD
        if (localStorage.getItem('Pro') !== 'true') {
            localStorage.setItem('Pro', 'true');
        }

        document.body.style.height = "1200px";

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
        document.getElementById('platform-spoofing').value = 'desktop-and-mobile';

        // Advertisements
        // document.getElementById('Pro-Coffee-Mikeyaworski').style = 'display: none;';
        // document.getElementById('Pro-Github-Mikeyaworski').style = 'display: none;';
        // document.getElementById('Pro-Github-MeetBhingradiya').style = 'display: none;';

        // Radio Selectors
        document.getElementById('Pro-Radio-Warp').style.display = 'flex';
        // ToggleSelect();

        // Icon8
        // document.getElementById('Icon8').style.marginLeft = '217px';

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
        // ? Credentials
        localStorage.removeItem('Pro');
        // ? Static Search
        // ? Random Search
        // ? Device Selectors
        // ? Advertisements
        // ? Control Panel
        document.getElementById('Pro-disable-alerts').checked = false;
        // ? Update All Changes INTO Storage


        // ! OLD
        // Credentials

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
        document.getElementById('platform-spoofing').value = 'desktop-only';

        // Advertisements
        // document.getElementById('Pro-Coffee-Mikeyaworski').style = 'display: block;';
        // document.getElementById('Pro-Github-Mikeyaworski').style = 'display: block;';
        // document.getElementById('Pro-Github-MeetBhingradiya').style = 'display: block;';

        // Icon8 Margin
        // document.getElementById('Icon8').style.marginLeft = '97px';

        // Radio Selectors
        document.getElementById('Pro-Radio-Warp').style.display = 'none';

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

// ? Upgrade To Pro Plan
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

// ? Downgrade To Free Plan
async function DowngradeToFree() {
    if (localStorage.getItem("Pro") !== null) {
        const Comfirm = confirm('Are you sure you want to downgrade to Free version?');

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

// ? Clear History Instantly
function ClearHistory() {
    chrome.history.deleteAll(
        function () {
            alert('History Cleared Sucsessfully !');
        }
    );
}

// ? Event Listeners For Inputs
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
    { id: 'Link-Options', eventType: 'click', fn: openOptions },
    // { id: 'Link-Settings', eventType: 'click', fn: LinkSettings },
    { id: 'stop', eventType: 'click', fn: stopSearches },
    { id: 'Upgrade', eventType: 'click', fn: UpgradeToPro },
    { id: 'Downgrade', eventType: 'click', fn: DowngradeToFree },
    { id: 'History', eventType: 'click', fn: ClearHistory },
];

// ? Save Changes
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
        // alert('Something Went Wrong While Checking For Updates !');
        PlanChange();
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
    VersionControl();
    Update_RadioBtn();
    PlanChange();
});

// ! Click Lable to Focus Input Field [Working in v2.4]

const FocusList = [
    {
        lableID: 'desktop-iterations-lable',
        inputID: 'desktop-iterations',
    },
    {
        lableID: 'Pro-Static-Mobile',
        inputID: 'mobile-iterations',
    },
    {
        lableID: 'Pro-Static-Delay',
        inputID: 'delay',
    },
]

FocusList.forEach(({ lableID, inputID }) => {
    document.getElementById(lableID).addEventListener('click', () => {
        document.getElementById(inputID).focus();
    });
});

// ! WARP END

// @ WARP Switch Toggle for All Checkbox [Working in v2.5]

document.getElementsByName('SwitchAPI').forEach((element) => {
    element.addEventListener('click', () => {
        element.childNodes.forEach((child) => {
            if (child.nodeName === 'INPUT' && child.type === 'checkbox') {
                child.checked = !child.checked;
            }
        })
    })
})

// @ WARP END

// ? Color Picker API [Pending in v2.5]

document.getElementsByName('ColorAPI').forEach((element) => {
    element.addEventListener('click', () => {
        element.childNodes.forEach((child) => {
            if (child.nodeName === 'INPUT' && child.type === 'color') {
                child.click();
            }
        })
    })

    element.childNodes.forEach((child) => {
        if (child.nodeName === 'INPUT' && child.type === 'color') {
            child.addEventListener('change', () => {
                document.body.style = `--accent-color: ${child.value}`
            })
        }
    });
});

document.getElementsByName('RangeAPI').forEach((element) => {
    element.childNodes.forEach((child) => {
        if (child.nodeName === 'INPUT' && child.type === 'range') {
            child.addEventListener('change', () => {
                document.body.style = `--border-radius: ${child.value}px`
            })
        }
    });
});


// const Json = {
//     Static_Search_Settings: {
//         Desktop: 45,
//         Mobile: 30,
//         Delay: 1000
//     },
//     Dynamic_Search_Settings: {
//         Searches: {
//             Min: 15,
//             Max: 45
//         },
//         Delay: {
//             Min: 1000,
//             Max: 3000
//         },
//     },
//     Device : "None", // "Desktop" | "Mobile" | "Both" | "None"
//     Shortcuts:{
//         Start_Search: "Control + Shift + S",
//         Stop_Search: "Control + Shift + X",
//         Toggle_Device: "Control + Shift + D",
//     },
//     Advanced: {
//         Dynamic_Search: false,
//         Fast_Script_Injection: false,
//         Auto_Click: false,
//         Random_Guesses: false,
//         Disable_Alerts: false,
//         Disable_Animations: false,
//         New_Device_Selector: false,
//         MiniMSR: false,
//         PersonalizeUI: false,
//         Shortcuts: false,
//         Load_Preset: false,
//         Dark_Mode_Only: false,
//     }
// }



// ! File END