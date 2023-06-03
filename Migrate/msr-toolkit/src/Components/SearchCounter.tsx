import React from 'react'

function SearchCounter() {
    return (
        <div className="SI" id="iteration-count-wrapper" style={{ display: "none"}}>
            <div className="Item">
                <div className="Item" id="Desktop-Warp">
                    <img src="https://img.icons8.com/fluency/128/null/imac.png" title="Desktop Search"
                        className="SIZE-CONTROL" />
                    <div id="iteration-count-1" className="WARP-MT-3 FontD"></div>
                </div>
                <div className="Item" id="Mobile-Warp">
                    <img src="https://img.icons8.com/fluency/128/null/iphone13.png" title="Mobile Search"
                        className="SIZE-CONTROL" />
                    <div id="iteration-count-2" className="WARP-MT-3 FontD"></div>
                </div>
                <div className="Item" id="Total-Warp">
                    <img src="https://img.icons8.com/fluency/128/null/search.png" title="Total Search"
                        className="SIZE-CONTROL" />
                    <div id="iteration-count-3" className="WARP-MT-3 FontD"></div>
                </div>
            </div>
        </div>
    )
}

export default SearchCounter