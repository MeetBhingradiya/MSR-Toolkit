/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@App/App';
import '@Styles/index';

enum Preset_Device_Spoof_type {
    None = "None",
    Desktop = "Desktop",
    Mobile = "Mobile",
    Both = "Both"
}

interface Preset_Type {
    Name: string,
    UniqueID: string,
    Static_Search_Settings: {
        Desktop: number
        Mobile: number
        Delay: number
    },
    Dynamic_Search_Settings: {
        Searches: {
            Min: number
            Max: number
        },
        Delay: {
            Min: number
            Max: number
        },
    },
    Device: Preset_Device_Spoof_type
    Advanced: {
        Dynamic_Search: boolean
        Fast_Script_Injection: boolean
        Auto_Click: boolean
        Random_Guesses: boolean
        Disable_Alerts: boolean
        Disable_Animations: boolean
        New_Device_Selector: boolean
        MiniMSR: boolean
        PersonalizeUI: boolean
        Shortcuts: boolean
        Load_Preset: boolean
        Dark_Mode_Only: boolean
        usePresets: boolean
    },
    Personalize: {
        Border_Radius: number
        Accent_Color: string
    }
}

enum Plan_Type {
    Free = "Free",
    Pro = "Pro",
}

interface Settings_Type {
    Name: string,
    Version: string,
    Plan: Plan_Type,
    Presets: Preset_Type[],
    Current_Preset: number,
    State: Preset_Type,
}

enum Page_Type {
    Home = "Home",
    Settings = "Settings",
    Presets = "Presets",
    Edit_Preset = "Edit_Preset",
    About = "About"
}

const Default_Settings: Settings_Type = {
    Name: "Microsoft Rewards Toolkit",
    Version: "v3.0",
    Plan: Plan_Type.Free,
    Presets: [
        {
            Name: "Default",
            UniqueID: "Default@03-06-23",
            Static_Search_Settings: {
                Desktop: 35,
                Mobile: 30,
                Delay: 1000
            },
            Dynamic_Search_Settings: {
                Searches: {
                    Min: 25,
                    Max: 35
                },
                Delay: {
                    Min: 1000,
                    Max: 3000
                },
            },
            Device: Preset_Device_Spoof_type.Desktop,
            Personalize: {
                Border_Radius: 8,
                Accent_Color: "#9729ff"
            },
            Advanced: {
                Dynamic_Search: false,
                Auto_Click: true,
                Disable_Alerts: false,
                Disable_Animations: false,
                Fast_Script_Injection: true,
                Dark_Mode_Only: false,
                MiniMSR: false,
                New_Device_Selector: true,
                PersonalizeUI: true,
                Load_Preset: true,
                Random_Guesses: false,
                Shortcuts: false,
                usePresets: false
            }
        }
    ],
    Current_Preset: 0,
    State: {
        Name: "Default",
        UniqueID: "Default@03-06-23",
        Static_Search_Settings: {
            Desktop: 35,
            Mobile: 30,
            Delay: 1000
        },
        Dynamic_Search_Settings: {
            Searches: {
                Min: 25,
                Max: 35
            },
            Delay: {
                Min: 1000,
                Max: 3000
            },
        },
        Device: Preset_Device_Spoof_type.Desktop,
        Personalize: {
            Border_Radius: 8,
            Accent_Color: "#9729ff"
        },
        Advanced: {
            Dynamic_Search: false,
            Auto_Click: true,
            Disable_Alerts: false,
            Disable_Animations: false,
            Fast_Script_Injection: true,
            Dark_Mode_Only: false,
            MiniMSR: false,
            New_Device_Selector: true,
            PersonalizeUI: true,
            Load_Preset: true,
            Random_Guesses: false,
            Shortcuts: false,
            usePresets: false
        }
    }
};


const ContextAPI = React.createContext({
    Settings: Default_Settings,
    setSettings: (Settings: Settings_Type) => { }
});

function WARPS() {
    const [Settings, setSettings] = React.useState(Default_Settings);


    React.useCallback(()=>{
        localStorage.setItem("Settings", JSON.stringify(Settings));
    },[Settings])

    React.useMemo(()=>{
        const Settings = localStorage.getItem("Settings");
        if (Settings) {
            setSettings((prev)=>{
                return JSON.parse(Settings);
            });
        }
    },[])

    return (
        <ContextAPI.Provider value={{ Settings, setSettings }}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ContextAPI.Provider>
    )
}

export { ContextAPI }
export type {
    Settings_Type,
    Preset_Type,
    Preset_Device_Spoof_type,
    Plan_Type,
    Page_Type
}

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(<WARPS />);