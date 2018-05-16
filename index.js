var fs = require('fs');

const DATA_SOURCE = 'data/source';
const FIELD_SIZE = 8;

main();

class Field {
    constructor (inputData) {
        // source is raw file data
        this.source = inputData;
        // data field is array of symbol arrays
        this.data = null;
    }

    // removing spaces, checking source data to be 8x8 field
    prepareData () {
        var rows = this.source.split('\n');
        var result = [];
        var self = this;
        if (rows.length !== FIELD_SIZE) return console.log('Rows count is not 8');
        rows.forEach(function(row, y) {
            // removing spaces to make sure each symbol in row is cell
            var spacelessRow = row.replace(/ /g, '');
            // string to arrays where each item is 'X' or 'O'
            var preparedRow = spacelessRow.split('');
            if (preparedRow.length !== FIELD_SIZE) return console.log('Row ' + y + ' is not 8 symbols length');
            result.push(preparedRow);
            self.data = result;
        })
    }

    // searching each mine
    countNonMineFields() {
        var self = this;
        this.data.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                if (cell === 'X') self.increaseMineNeighbours(x, y);
            })
        })
    }
    
    // each non-mine field around mine should increase it's counter
    increaseMineNeighbours (x, y) {
        this.increaseCell(x - 1, y - 1);
        this.increaseCell(x - 1, y);
        this.increaseCell(x - 1, y + 1);
        this.increaseCell(x + 1, y + 1);
        this.increaseCell(x + 1, y);
        this.increaseCell(x + 1, y - 1);
        this.increaseCell(x, y - 1);
        this.increaseCell(x, y + 1);
    }

    // check if x,y is inside the field
    cellExists (x, y) {
        return !(x < 0) && !(x > FIELD_SIZE - 1) && !(y < 0) && !(y > FIELD_SIZE - 1)
    }

    // checks if it's non-mine field, sets it to integer for further increment
    increaseCell (x, y) {
        if (!this.cellExists(x, y)) return;
        var cell = this.data[y][x];
        if (cell === 'X') return;
        if (cell === 'O') cell = 1;
        else cell += 1;
        this.data[y][x] = cell;
    }

    // correct representation of mine field
    showField () {
        this.data.forEach(function (row, y) {
            var rowToLog = '';
            row.forEach(function (cell, x) {
                rowToLog += cell + ' '
            });
            rowToLog += '\n';
            console.log(rowToLog);
        })
    }

}

// main function, entry point
function main () {
    //reading source file for file system
    fs.readFile(DATA_SOURCE, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        // initializing field calss with raw data
        var field = new Field(data);
        field.prepareData();
        field.countNonMineFields();
        field.showField();
        // TODO: output field into the file.
    });
}