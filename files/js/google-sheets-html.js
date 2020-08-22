


var data;
$.ajax({
  type: "GET",
  url: "https://docs.google.com/spreadsheets/d/1AS_fsPWZiHqagc9RONpA9ZN15dvyHm1BylgMYTudgcg/export?format=csv",
  dataType: "text",
  success: function(response)
  {
    data = $.csv.toArrays(response);
    handleData(data);
  }
});

function handleData(data) {
    fallos = []
    data.shift()

    $.each(data, function( index, row ) {
        var voces = row[6] + " " + row[7] + " " + row[8]
        voces = voces.toLowerCase()

        datos = [
            $("<a>", {
                href: row[10],
                text: row[2] ? row[2] : "n/a"
            }),
            $('<br>'),
            $('<p>').append(row[9] ? row[9] : ""),
            $('<p>').append(voces ? "<b>Voces:</b> " + voces: "" )
        ]
        // console.log(datos)

        fallos.push({
            "Fecha": row[5],
            "DJ": row[4],
            "Juzgado": row[3],
            "Datos": datos
        })
    });


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
