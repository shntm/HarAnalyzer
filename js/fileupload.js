function dropHandler(ev) {
    console.log('File(s) dropped');
    document.getElementsByClassName("drop-zone")[0].style.visibility = "hidden";
    document.getElementsByClassName("lds-ring")[0].style.visibility = "visible";
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                readFileAsJSON(file, showJSONInTable);
            }
        }
    }
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    document.getElementsByClassName("drop-zone")[0].style.opacity = "0.5";
}