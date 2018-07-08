/*!
 *
 * Google Sheets To HTML v0.9a
 *
 * To use, simply replace the "tq?key=" value in the
 * URL below with your own unique Google document ID
 *
 * The Google document's sharing must be set to public
 *
 */

google.load('visualization', '1', {
    packages: ['table']
});
var visualization;

function drawVisualization() {
    var query = new google.visualization.Query('https://spreadsheets.google.com/tq?key=1AS_fsPWZiHqagc9RONpA9ZN15dvyHm1BylgMYTudgcg&output=html&usp=sharing');
    query.setQuery('SELECT C, D, E, F, K, J, G, H, I');
    query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
    if (response.isError()) {
        alert('Error accediendo a los datos: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }
    container = $("#datos")
    data = response.getDataTable();
    fallos = []

    for (var p in data.Nf) {
        var fallo = data.Nf[p].c;

        var voces = (fallo[6] && fallo[6].v ? fallo[6].v : "") + (fallo[7]  && fallo[7].v ? ", " + fallo[7].v : "") + (fallo[8]  && fallo[8].v ? ", " + fallo[8].v : "")
        voces = voces.toLowerCase()

        datos = [
            $("<a>", {
                href: fallo[4] ? fallo[4].v : "#",
                text: fallo[0] ? fallo[0].v.toUpperCase() : "n/a"
            }),
            $('<br>'),
            $('<p>').append(fallo[5] ? fallo[5].v : ""),
            $('<p>').append(voces ? "<b>Voces:</b> " + voces: "" )
        ]

        fallos.push({
            "Fecha": fallo[3] ? fallo[3].f : "n/a",
            "DJ": fallo[2] ? fallo[2].v : "n/a",
            "Juzgado": fallo[1] ? fallo[1].v : "n/a",
            "Datos": datos
        })
    }

    $("#datos").jsGrid({
        width: "100%",
        height: "700px",

        inserting: false,
        editing: false,
        sorting: true,
        paging: true,

        data: fallos,

        fields: [
            {
                width: 70,
                name: "Datos",
                type: "text",
                validate: "required",
                sorter: function (value1, value2) {
                    var t1 = value1[0][0].text
                    var t2 = value2[0][0].text
                    var r = 0
                    if (t1 < t2) {
                        r = 1
                    }
                    if (t1 > t2) {
                        r = -1
                    }
                    return r
                }
            },
            {
                width: 10,
                name: "Fecha",
                type: "text",
                sorter: function (value1, value2) {
                    var f1 = value1.split('/')
                    var f2 = value2.split('/')
                    if (parseInt(f1[2]) < parseInt(f2[2])) // Year
                    {
                        return 1
                    }
                    if (parseInt(f1[2]) > parseInt(f2[2]))
                    {
                        return -1
                    }
                    if (parseInt(f1[1]) < parseInt(f2[1])) // Month
                    {
                        return 1
                    }
                    if (parseInt(f1[1]) > parseInt(f2[1]))
                    {
                        return -1
                    }
                    if (parseInt(f1[0]) < parseInt(f2[0])) // Day
                    {
                        return 1
                    }
                    if (parseInt(f1[0]) > parseInt(f2[0]))
                    {
                        return -1
                    }
                    return 0
                }
            },
            {
                width: 10,
                name: "DJ",
                type: "text"
            },
            {
                width: 10,
                name: "Juzgado",
                type: "text"
            }
        ]
    });
    $("#datos").jsGrid("sort", { field: "Datos", order: "desc" });
}
google.setOnLoadCallback(drawVisualization);