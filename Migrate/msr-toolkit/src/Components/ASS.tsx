import React from "react"
import { ContextAPI } from "@App/Main"

export default function Advanced_Search_Settings() {

    const { Settings ,  setSettings } = React.useContext(ContextAPI);

    const [DataJson , SetDataJson] = React.useState(Settings.Presets[Settings.Current_Preset].Advanced)

    React.useMemo(()=> {
        SetDataJson(Settings.State.Advanced)
    },[DataJson])

    React.useCallback(()=>{
        setSettings({
            ...Settings,
            State: {
                ...Settings.State,
                Advanced: DataJson
            }
        })
    },[DataJson])

    interface Data_Type {
        id: number,
        title: string,
        Text: string,
        /**
         * ! Temp ElementID
         */
        ElementID?: string,
        CheckboxID?: string,
        isPro?: boolean,
        ProState? : boolean
        isBeta?: boolean,
        ChekboxValue?: boolean
    }

    const Data: Array<Data_Type> = [
        {
            id: 1,
            title: "Random Search",
            Text: "Dynamic Search",
            CheckboxID: "random-search",
            isPro: true,
            ChekboxValue: DataJson.Dynamic_Search
        },
        {
            id: 2,
            title: "Blitz Search",
            Text: "Fast Script Injection",
            CheckboxID: "blitz-search",
            ChekboxValue: DataJson.Fast_Script_Injection
        },
        {
            id: 3,
            title: "Auto Click Quizze Answers",
            Text: "Auto Click Answers",
            CheckboxID: "auto-click",
            isPro: true,
            ProState: true,
            ChekboxValue: DataJson.Auto_Click
        },
        {
            id: 4,
            title: "use Random Answers for Quizze",
            Text: "Random Guesses",
            CheckboxID: "random-guesses",
            isPro: false,
            ProState: false,
            ChekboxValue: DataJson.Random_Guesses
        },
        {
            id: 5,
            title: "Alert On Click Clear History",
            Text: "Disable Alerts",
            CheckboxID: "disable-alerts",
            isPro: true,
            ProState: true,
            ChekboxValue: DataJson.Disable_Alerts
        },
        {
            id: 6,
            title: "New Select",
            Text: "New Select",
            CheckboxID: "new-select",
            isPro: true,
            ProState: true,
            ChekboxValue: DataJson.New_Device_Selector
        },
        {
            id: 7,
            title: "Mini Mode For Microsoft Rewards Toolkit",
            Text: "Mini MSR",
            CheckboxID: "MSR-Mini",
            isPro: true,
            ProState: false,
            isBeta: true,
            ChekboxValue: DataJson.MiniMSR
        },
        {
            id: 8,
            title: "UI/UX Customization",
            Text: "Personalize",
            CheckboxID: "UI-UX",
            isPro: true,
            ProState: true,
            isBeta: true,
            ChekboxValue: DataJson.PersonalizeUI
        },
        {
            id: 9,
            title: "Keyboard Shortcuts",
            Text: "Shortcuts",
            CheckboxID: "shortcuts",
            isPro: true,
            ProState: false,
            isBeta: true,
            ChekboxValue: DataJson.Shortcuts
        },
        {
            id: 10,
            title: "Load Your Old Settings",
            Text: "use Presets",
            CheckboxID: "use-presets",
            isPro: true,
            ProState: true,
            isBeta: true,
            ChekboxValue: DataJson.usePresets
        },
    ]

    const ONChangeHandle = (e: React.ChangeEvent<HTMLInputElement> , id: number) => {
        Data[id].ChekboxValue = e.target.checked
    }

    return (
        <div className="ASS">
            <div className="Item_Head" title="Random Search Settings">
                <img src="https://img.icons8.com/fluency/128/null/settings.png" alt="search" />
                Advanced Search Settings [Limited Time]
            </div>
            <div className="DIVIDER-2"></div>
            {
                Data.map((Element, Index) => {
                    return (
                        <label className="Item" id={Element.ElementID} title={Element.title} name="SwitchAPI" key={Index}>
                            <input type="checkbox" id={Element.CheckboxID} checked={Element.ChekboxValue} />
                            <div className="Switch"></div>
                            {Element.Text} {Element.isBeta ? "[Beta]" : ""}
                        </label>
                    )
                })
            }
        </div>
    )
}