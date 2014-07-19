$(function(){
    $.tablesorter.addParser({
        id: 'prettyDate',
        is: function (s) {
            return false;
        },
        format: function (s, table, cell) {
            return $(cell).attr('data-date');
        },
        type: 'numeric'
    });

    $('table.tablesorter').tablesorter({
        headers: {
            4: {
                sorter: 'prettyDate'
            }
        }
    });
});