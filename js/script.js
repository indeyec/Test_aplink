

let data = {
  "prices": {
      "pvc": {
          "white": 1390,
          "colorful": 1600
      },
      "fabric": {
          "white": 2250,
          "colorful": 2500
      },
      "corner_price": 100
  }
};

function calculateCost() {
  let area = parseFloat($('#area').val());
  let corners = parseInt($('#corners').val());
  let color = $('#color').val();
  let texture = $('#texture').val();

  console.log("Area:", area);
  console.log("Corners:", corners);
  console.log("Color:", color);
  console.log("Texture:", texture);

  // Проверка на опцию "Тканевый"
  if (texture === 'fabric'&& color ==='colorful') {
      $('#result').text("Нет в наличии");
  } else if (!isNaN(area) && !isNaN(corners) && area >= 10 && corners >= 0) {
      let price_per_sqm = data.prices[texture][color];
      let corner_price = data.prices["corner_price"];
      let price = price_per_sqm * area + corner_price * corners;
      console.log("Price:", price);
      $('#result').text("Стоимость натяжного потолка: " + price + " руб");
  } else {
      console.log("Invalid input for area or corners.");
      $('#result').text("");
  }
}

calculateCost();

$('#area, #corners').on('input', calculateCost);
$('#color, #texture').on('change', calculateCost);

$(document).ready(function() {
  $('.content__inp').each(function() {
      const $inputNumberElement = $(this);
      const $minusButton = $inputNumberElement.siblings('.content__btn--minus');
      const $plusButton = $inputNumberElement.siblings('.content__btn--plus');

      $minusButton.on('click', function() {
          let value = parseInt($inputNumberElement.val());
          if (!isNaN(value) && value > parseInt($inputNumberElement.attr('min'))) {
              $inputNumberElement.val(value - 1);
              console.log("Minus button clicked. Value:", $inputNumberElement.val());
          }
          calculateCost();
      });

      $plusButton.on('click', function() {
          let value = parseInt($inputNumberElement.val());
          if (!isNaN(value) && value < parseInt($inputNumberElement.attr('max'))) {
              $inputNumberElement.val(value + 1);
              console.log("Plus button clicked. Value:", $inputNumberElement.val());
          }
          calculateCost();
      });
  });
});


