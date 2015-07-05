$(function() {

    var tableDataForEdit = {};
    var counter = 1;
    $('#record-id, #edit-record-id').prop( "disabled", true );

    // Takes user input values and puts them into the table
    function dataToTable() {
        var recordId = $('#record-id').val();
        var artist = $('#artist').val();
        var album = $('#album').val();
        var release = $('#release').val();
        var genre = $('#genre option:selected').text();
        var buttonEdit = '<button class="btn-edit">Edit</button>';
        var numRelease = Number(release);

        var dataset = '';
        dataset = '<tr><td>' + counter + '</td>';
        dataset +='<td>' + artist + '</td>';
        dataset +='<td>' + album + '</td>';
        dataset +='<td>' + numRelease.toFixed() + '</td>';
        dataset +='<td class="genre">' + genre + '</td>';
        dataset +='<td>' + buttonEdit + '</td>';

        $('#main-table tbody').append(dataset);
        $('.graph-title').show();

        counter++;

        $('#record-id').val(counter);
    }

    // Takes data from table and sends it to the graph
    function dataToPieGraph() {
        var pop = 0;
        var rock = 0;
        var electronic = 0;
        var other = 0;
        var tableData = $('.genre');

        // Converts object to an array
        var dataToPieArray = tableData.map(function() {
            return $(this).text();
        }).get();

        for (var i = 0; i < dataToPieArray.length; i++) {
            if (dataToPieArray[i] === 'Pop') {
                pop++;
            } else if (dataToPieArray[i] === 'Rock') {
                rock++;
            } else if (dataToPieArray[i] === 'Electronic') {
                electronic++;
            } else if (dataToPieArray[i] === 'Other') {
                other++;
            }
        }

        var pieData = '<tr><td>Pop</td><td>' + pop + '</td></tr>';
            pieData += '<tr><td>Rock</td><td>' + rock + '</td></tr>';
            pieData += '<tr><td>Electronic</td><td>' + electronic + '</td></tr>';
            pieData += '<tr><td>Other</td><td>' + other + '</td></tr>';

        $('#pie-graph tbody').html(pieData);
    }

    // Takes data from the table and puts it into the inputs interface for editing
    function dataToEdit() {
        tableDataForEdit = $this.parent().parent().children();
        var dataToArray = tableDataForEdit.map(function() {
            return $(this).text();
        }).get();

        $('#edit-record-id').val(dataToArray[0]);
        $('#edit-artist').val(dataToArray[1]);
        $('#edit-album').val(dataToArray[2]);
        $('#edit-release').val(dataToArray[3]);
        $('#edit-genre option:selected').text(dataToArray[4]);
    }

    // When/if data is edited, this function sends new/changes to the table
    function editedToTable() {
        var editedRecordId = $('#edit-record-id').val();
        var editedArtist = $('#edit-artist').val();
        var editedAlbum = $('#edit-album').val();
        var editedRelease = $('#edit-release').val();
        var editedGenre = $('#edit-genre option:selected').text();

        $(tableDataForEdit[0]).text(editedRecordId);
        $(tableDataForEdit[1]).text(editedArtist);
        $(tableDataForEdit[2]).text(editedAlbum);
        $(tableDataForEdit[3]).text(editedRelease);
        $(tableDataForEdit[4]).text(editedGenre);

        dataToPieGraph();
        loadHighChart();
        tableSorting();
    }

    // Opens edit tab, hides other tabs
    function onlyEditTab() {
        $('#edit-tab-title').fadeIn();
        $('#tab-2').removeClass('active');
        $('#tab-3').addClass('active');
        $('ul li:nth-child(2)').removeClass('active');
        $('ul li:nth-child(3)').addClass('active');
        $('#add-tab-title, #overview-tab-title').hide();
        $('ul li:lt(2)').css('margin-right', '0');
    }

    // Closes edit tab, restores default tabs
    function closeOnlyEditTab() {
        $('#edit-tab-title').hide();
        $('#tab-3').removeClass('active');
        $('#tab-2').addClass('active');
        $('ul li:nth-child(3)').removeClass('active');
        $('ul li:nth-child(2)').addClass('active');
        $('#add-tab-title, #overview-tab-title').fadeIn();
        $('ul li:lt(2)').css('margin-right', '2em');
    }

    // Loads Highcharts table/graphs
    function loadHighChart() {
        $('[data-highcharts-chart]').remove();
        $('table.highchart').highchartTable();
    }

    // Handler for empting input values
    function resetNewRecord() {
            $('#artist').val('');
            $('#album').val('');
            $('#release').val('');
    }

    // Uses Tablesorter plugin
    function tableSorting() {
         $("#main-table").tablesorter();
    }

    // Tabs functionality
    function tabs() {
        $('.tab-list').each(function() {
            var $this = $(this);
            var tab = $this.find('li.active');
            var link = tab.find('a');
            var panel = $(link.attr('href'));

            $this.on('click', '.tab-control', function(e) {
                e.preventDefault();
                var link = $(this),
                id = this.hash;

                if (id && !link.is('.active')) {
                    panel.removeClass('active');
                    tab.removeClass('active');

                    panel = $(id).addClass('active');
                    tab = link.parent().addClass('active');
                }
            });
        });
    }

    tabs();

    // Event Handlers
    $('#cancel-edit').on('click', function() {
            closeOnlyEditTab();
    });

    $('#btn-add-new').on('click', function() {
        var artist = $('#artist').val();
        var album = $('#album').val();

        if (artist === '' || album === '') {
            alert('Please fill correctly all required fields!');
        } else {
            dataToTable();
            dataToPieGraph();
            loadHighChart();
            tableSorting();
            resetNewRecord();
        }
    });

    $('#main-table tbody').on('click', '.btn-edit', function() {
            $this =  $(this);
            dataToEdit();
            onlyEditTab();
    });

    $('#btn-save-changes').on('click', function() {
        var editArtist = $('#edit-artist').val();
        var editAlbum = $('#edit-album').val();

        if (editArtist === '' || editAlbum === '') {
            alert('Please fill correctly all required fields!');
        } else {
            closeOnlyEditTab();
            editedToTable();
            dataToPieGraph();
            loadHighChart();
            tableSorting();
        }
    });

    $('#cancel-new').on('click', function() {
        resetNewRecord();
    });

});