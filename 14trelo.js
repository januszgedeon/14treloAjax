var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': 685,
  'X-Auth-Token': "b724010fbc4c28c30b4842fc36261d9c"
};

$.ajaxSetup({
  headers: myHeaders
});

$.ajax({
  url: baseUrl + '/board',
  method: 'GET',
  success: function(response) {
    setupColumns(response.columns);
  }
});

function setupColumns(columns) {
  columns.forEach(function(column) {
    var col = new Column(column.id, column.name);
    board.createColumn(col);
    setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
  cards.forEach(function(card) {
    var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    
    col.addCard(card);
  })
}

//$(function() {

function randomString() {
  var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  var str = '';
  var i = 0;
  for (i = 0; i < 10; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function Column(id, name) {
  var self = this; // przyda się dla funkcji zagnieżdżonych

  this.id = id;
  this.name = name;
  this.$element = createColumn();

  function createColumn() {
    // TWORZENIE ELEMENTÓW SKŁADOWYCH KOLUMNY
    var $column = $('<div>').addClass('column');
    var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
    var $columnCardList = $('<ul>').addClass('column-list');
    var $columnDelete = $('<button>').addClass('btn-delete').text('X');
    var $columnAddCard = $('<button>').addClass('add-card').text('Dodaj zadanie');

    // PODPINANIE ODPOWIEDNICH ZDARZEŃ
    $columnDelete.click(function() {
      self.removeColumn();
    });
    $columnAddCard.click(function(event) {
      var cardName = prompt("Wpisz nazwę karty");
      event.preventDefault();

      $.ajax({
        url: baseUrl + '/card',
        method: 'POST',
        data: {
          name: cardName,
          bootcamp_kanban_column_id: self.id
        },
        success: function(response) {
          var card = new Card(response.id, cardName);
          self.addCard(card);
        }
      });
    });
    // KONSTRUOWANIE ELEMENTU KOLUMNY
    $column.append($columnTitle)
      .append($columnDelete)
      .append($columnAddCard)
      .append($columnCardList);

    // ZWRACANIE STWORZONEJ  KOLUMNY
    return $column;
  }
}
Column.prototype = {
  addCard: function(card) {
    this.$element.children('ul').append(card.$element);
  },
  removeColumn: function() {
    var self = this;
    $.ajax({
      url: baseUrl + '/column/' + self.id,
      method: 'DELETE',
      success: function() {

        self.$element.remove();

      }
    });
  }

};
Card.prototype = {
  removeCard: function() {
    var self = this;
     $.ajax({
      url: baseUrl + '/card/' + self.id,
      method: 'DELETE',
      success: function(){
        self.$element.remove();
      }
    });
}}

function Card(id, description) {
  var self = this;
   
   

  this.id = id;
  this.description = description;
  this.$element = createCard(); //

  function createCard() {
    // TWORZENIE KLOCKÓW
    var $card = $('<li>').addClass('card');
    var $cardDescription = $('<p>').addClass('card-description').text(self.description);
    var $cardDelete = $('<button>').addClass('btn-delete').text('X');

    // PRZYPIĘCIE ZDARZENIA
    $cardDelete.click(function() {
      self.removeCard();
    });

    // SKŁADANIE I ZWRACANIE KARTY
    $card.append($cardDelete)
      .append($cardDescription);

    return $card;
  }

}

function initSortable() {
  $('.column-list').sortable({
    connectWith: '.column-list',
    placeholder: 'card-placeholder'
  }).disableSelection();
}
var board = {
  name: 'Tablica Kanban',

  createColumn: function(column) {
    this.element.append(column.$element);
    initSortable();
  },
  element: $('#board .column-container')
};
$('.create-column')
  .click(function() {
    var columnName = prompt('Wpisz nazwę kolumny');
    $.ajax({
      url: baseUrl + '/column',
      method: 'POST',
      data: {
        name: columnName
      },
      success: function(response) {
        var column = new Column(response.id, columnName);
        board.createColumn(column);
      }
    });
  });
// TWORZENIE KOLUMN
/* var todoColumn = new Column('Do zrobienia');
  var doingColumn = new Column('W trakcie');
  var doneColumn = new Column('Skończone');

  // DODAWANIE KOLUMN DO TABLICY
  board.addColumn(todoColumn);
  board.addColumn(doingColumn);
  board.addColumn(doneColumn);

 

  // DODAWANIE KART DO KOLUMN
  todoColumn.addCard(card1);
  doingColumn.addCard(card2);

});*/