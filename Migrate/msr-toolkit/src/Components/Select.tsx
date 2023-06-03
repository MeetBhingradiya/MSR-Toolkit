import React from "react"

function Select() {
    return (
        <div className="SelectWarp GlassEffect WARP-MT-10" style={{display: "none"}}>
            <select id="platform-spoofing">
                <option value="desktop-only">Desktop</option>
                <option value="mobile-only" id="Pro-Mobile">Mobile</option>
                <option value="desktop-and-mobile" id="Pro-Both">Both</option>
                <option value="none" id="Pro-Spoofing">OFF</option>
            </select>
        </div>
    )
}

export default Select