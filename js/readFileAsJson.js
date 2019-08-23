function readFile(evt) {
    readFileAsJSON(evt, showJSONInTable);
}

function readFileAsJSON(file, callback) {
    var f = file;

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            callback(JSON.parse(contents));
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}


function showJSONInTable(jsonToShow) {
    console.log(jsonToShow);
    var rows = [];
    jsonToShow.log.entries.forEach(function (entry) {
        var path = (new URL(entry.request.url)).pathname;
        path = path.match("(?:[^/]+)$");
        if (path) {
            path = path[0];
        } else {
            path = "/"
        }
        rows.push({
            "requestPath": path,
            "time": Math.round(entry.time),
            "type": entry._resourceType,
            "status": entry.response.status
        });
    })
    $('.table').footable({
        "columns": [
            { "name": "requestPath", "title": "Path", "breakpoints": "xs", type: "text" },
            { "name": "time", "title": "Time", type: "number" },
            { "name": "type", "title": "Type", type: "text" },
            { "name": "status", "title": "Status", "type": "number" },
        ],
        "rows": rows,
        sorting: {
            enabled: true
        }
    });
    document.getElementsByClassName("lds-ring")[0].style.visibility = "hidden";
    chartIt(rows);
}


function chartIt(tableData) {
    tableData = sortByTime(tableData);
    let chart = new frappe.Chart(".chart", { // or DOM element
        data: {
            labels: getKeyValuesFromArray(tableData, "requestPath"),

            datasets: [
                {
                    name: "Table Data", chartType: 'pie',
                    values: getKeyValuesFromArray(tableData, "time")
                }
            ],
        },
        type: 'pie', // or 'bar', 'line', 'pie', 'percentage'
        height: 300,
        width: 300,
        colors: ['purple', '#ffa3ef', 'light-blue'],

        tooltipOptions: {
            formatTooltipX: d => (d + '').toUpperCase(),
            formatTooltipY: d => d + ' pts',
        },
        maxLegendPoints: 0
    });

    document.getElementsByClassName("chart-legend")[0].style.visibility = "hidden";
}

function sortByTime(tableData) {
    tableData.sort(function (a, b) {
        return b.time - a.time;
    });
    return tableData;
}

function getKeyValuesFromArray(jsonArray, key) {
    var returnArray = [];
    for (var i = 0; i < jsonArray.length; i++) {
        returnArray.push(jsonArray[i][key]);
    }
    return returnArray;
}