import React from 'react';
import Advanced_Search_Settings from '@Components/ASS';
import Select from '@Components/Select';
import SearchCounter from '@Components/SearchCounter';
import { ContextAPI } from '@App/Main';

export default function App() {
    const { Settings , setSettings } = React.useContext(ContextAPI);

    const isProPlan = () => {
        if(localStorage.getItem("Pro") === "true"){
            return true
        } else {
            return false
        }
    }

    return (
        <>
            <a className="Head" id="open-reward-tasks" href="https://rewards.bing.com/" target="_blank"
                title="Go To Microsoft Rewards">
                <div className="Brand">
                    <div className="Icon">
                        <img src="./icons/rewards.svg" />
                    </div>
                    <div className="Title">
                        {Settings.Name}
                    </div>
                </div>
                <div className="Details">
                    <div className="Version" id="Pro-ID">
                        {Settings.Version} {Settings.Plan}
                    </div>
                </div>
            </a>

            <div className="WARP-10">

                <div id="static-search-input-wrapper" className="SDSS">
                    <div className="Item_Head" title="Random Search Settings">
                        <img src="https://img.icons8.com/fluency/128/search.png" alt="search" />
                        Device Search Settings
                    </div>
                    <div className="DIVIDER-1"></div>
                    <div className="Item">
                        <div className="Item" id="desktop-iterations-lable">
                            <img src="https://img.icons8.com/fluency/128/null/imac.png" title="Desktop Search" />
                            <input type="number" min="1" max="70" id="desktop-iterations" />
                        </div>
                        <div className="Item" id="Pro-Static-Mobile">
                            <img src="https://img.icons8.com/fluency/128/null/iphone13.png" title="Mobile Search" />
                            <input type="number" min="1" max="70" id="mobile-iterations" />
                        </div>
                    </div>
                    <div className="DIVIDER-1" id="Pro-Static-Divide"></div>
                    <div className="Item">
                        <div className="Item" style={{ display: "none", width: "250px" }} id="Pro-Static-Delay">
                            <img src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-delay-modern-dating-flaticons-flat-flat-icons-2.png"
                                title="Delay (ms)" />
                            <input type="number" min="1000" max="40000" step="200" id="delay" style={{ width: "150px" }} />
                        </div>
                    </div>
                </div>

                <div className="DDSS" id="random-search-input-wrapper">
                    <div className="Item_Head" title="Random Search Settings">
                        <img src="https://img.icons8.com/fluency/128/search.png" alt="search" />
                        Dynamic Search Settings
                    </div>
                    <div className="DIVIDER-1"></div>
                    <div className="Item">
                        <div className="Item" title="Minimum Searches">
                            <img src="https://img.icons8.com/fluency/128/long-arrow-down.png" className="SIZE-CONTROL" />
                            <input type="number" min="1" max="100" id="random-search-iterations-min" />
                        </div>
                        <div className="Item" title="Maximum Searches">
                            <img src="https://img.icons8.com/fluency/128/long-arrow-up.png" className="SIZE-CONTROL" />
                            <input type="number" min="1" max="100" id="random-search-iterations-max" />
                        </div>
                    </div>
                    <div className="Item_Head WARP-MT-10" title="Random Delay Settings">
                        <img src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-delay-modern-dating-flaticons-flat-flat-icons-2.png"
                            alt="Delay" />
                        Delay Settings
                    </div>
                    <div className="DIVIDER-1"></div>
                    <div className="Item">
                        <div className="Item" title="Minimum Delay">
                            <img src="https://img.icons8.com/fluency/128/long-arrow-down.png" className="SIZE-CONTROL" />
                            <input type="number" min="1000" max="60000" step="1000" id="random-search-delay-min" />
                        </div>
                        <div className="Item" title="Maximum Delay">
                            <img src="https://img.icons8.com/fluency/128/long-arrow-up.png" className="SIZE-CONTROL" />
                            <input type="number" min="1000" max="60000" step="1000" id="random-search-delay-max" />
                        </div>
                    </div>
                </div>

                <div className="DSS" id="Pro-Radio-Warp">
                    <div className="Item_Head" title="Random Search Settings">
                        <img src="https://img.icons8.com/fluency/128/search.png" alt="search" />
                        Device Spoof Settings
                    </div>
                    <div className="DIVIDER-2"></div>
                    <div className="DSS-Item-Warp">
                        <div className="Item">
                            <input type="radio" name="Device" id="Radio-Desktop" value="desktop-only" readOnly />
                            <label htmlFor="Radio-Desktop">
                                <img src="https://img.icons8.com/fluency/128/null/imac.png" title="Desktop Search"
                                    className="SIZE-CONTROL" />
                            </label>
                        </div>
                        <div className="Item">
                            <input type="radio" name="Device" id="Radio-Moblie" value="mobile-only" readOnly />
                            <label htmlFor="Radio-Moblie">
                                <img src="https://img.icons8.com/fluency/128/null/iphone13.png" title="Desktop Search"
                                    className="SIZE-CONTROL" />
                            </label>
                        </div>
                        <div className="Item">
                            <input type="radio" name="Device" id="Radio-Both" value="desktop-and-mobile" readOnly />
                            <label htmlFor="Radio-Both">
                                <img src="https://img.icons8.com/fluency/128/null/imac.png" title="Desktop Search"
                                    className="SIZE-CONTROL" />
                                <img src="https://img.icons8.com/fluency/128/null/iphone13.png" title="Desktop Search"
                                    className="SIZE-CONTROL" />
                            </label>
                        </div>
                        <div className="Item">
                            <input type="radio" name="Device" id="Radio-No-Spoofing" value="none" readOnly />
                            <label htmlFor="Radio-No-Spoofing">
                                <img src="https://img.icons8.com/fluency/128/null/search.png" title="Both Search"
                                    className="SIZE-CONTROL" />
                            </label>
                        </div>
                    </div>
                </div>

                <SearchCounter />

                <div className="UI-UX">
                    <div className="Item_Head">
                        <img src="https://img.icons8.com/fluency/128/cosmetic-brush.png" alt="cosmetic-brush" />
                        Personalize UI
                    </div>
                    <div className="DIVIDER-2"></div>

                    <div className="Colors">
                        Theme Color
                        <div className="ColorPicker">
                            <input type="color" name="AccentColor" id="UI-AccentColor" />
                        </div>
                    </div>

                    <div className="Item">
                        Curve
                        <div className="BR">
                            <input type="range" name="BorderRadius" id="UI-BorderRadius" min="0" max="20" value="8" />
                        </div>
                    </div>
                </div>

                <Advanced_Search_Settings />
                <Select />
                


                {/* <!-- <div className="oldFoot GlassEffect">
                    <a href="https://Github.com/MeetBhingradiya" className="FootItem" title="MeetBhingradiya"
                        id="Pro-Github-MeetBhingradiya">
                        <img src="https://img.icons8.com/fluency/128/null/github.png" />
                    </a>
                    <a href="https://github.com/mikeyaworski" className="FootItem" title="mikeyaworski"
                        id="Pro-Github-Mikeyaworski">
                        <img src="https://img.icons8.com/fluency/128/null/github.png" />
                    </a>
                    <a href="https://www.buymeacoffee.com/mikeyaworski" className="FootItem" title="mikeyaworski' Coffee"
                        id="Pro-Coffee-Mikeyaworski">
                        <img src="https://img.icons8.com/fluency/128/null/coffee-to-go.png" />
                    </a>
                    <a href="https://icons8.com/" className="FootItem ICON8" title="Powered by Icons8.com" id="Icon8">
                        Powered by <img src="https://img.icons8.com/fluency/128/null/icons8-new-logo.png" />
                    </a>
                </div> --> */}

            </div>

            <div className="Foot" title="Control Panel">
                <div className="Item">
                    <input type="button" value="" id="search" className="IconBtn IconBtn-start" title="Start Search" />
                    <input type="button" value="" id="stop" className="IconBtn IconBtn-stop" title="Stop Search" />
                    <input type="button" value="" id="reset" className="IconBtn IconBtn-reset" title="Reset Settings" />
                </div>
                <div className="Item">
                    <input type="button" value="" id="Link-Options" className="IconBtn IconBtn-settings" title="Go To Options" />
                    {/* <!-- <input type="button" value="" id="Link-Settings" className="IconBtn IconBtn-settings" title="Go To Settings"> --> */}
                    <input type="button" value="" id="History" className="IconBtn IconBtn-History" title="Clear History" />
                    <input type="button" value="" id="Downgrade" className="IconBtn IconBtn-Downgrade" title="Pro To Free Downgrade" />
                    <input type="button" value="" id="Upgrade" className="IconBtn IconBtn-Upgrade" title="Free To Pro Upgrade" />
                </div>
            </div>
        </>
    )
}