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
        $('#result-calc').text("Нет в наличии");
    } else if (!isNaN(area) && !isNaN(corners) && area >= 10 && corners >= 0) {
        let price_per_sqm = data.prices[texture][color];
        let corner_price = data.prices["corner_price"];
        let price = price_per_sqm * area + corner_price * corners;
        console.log("Price:", price);
        $('#result').text("Стоимость натяжного потолка: " + price + " руб");
        $('#result-calc').html("Итого: <span>" + price + "</span> руб");
    } else {
        console.log("Invalid input for area or corners.");
        $('#result').text("");
    }
}

calculateCost();

$('#area, #corners').on('input', calculateCost);
$('#color, #texture').on('change', calculateCost);

$(document).ready(function () {
    $('.content__inp').each(function () {
        const $inputNumberElement = $(this);
        const $minusButton = $inputNumberElement.siblings('.content__btn--minus');
        const $plusButton = $inputNumberElement.siblings('.content__btn--plus');

        $minusButton.on('click', function () {
            let value = parseInt($inputNumberElement.val());
            if (!isNaN(value) && value > parseInt($inputNumberElement.attr('min'))) {
                $inputNumberElement.val(value - 1);
                console.log("Minus button clicked. Value:", $inputNumberElement.val());
            }
            calculateCost();
        });

        $plusButton.on('click', function () {
            let value = parseInt($inputNumberElement.val());
            if (!isNaN(value) && value < parseInt($inputNumberElement.attr('max'))) {
                $inputNumberElement.val(value + 1);
                console.log("Plus button clicked. Value:", $inputNumberElement.val());
            }
            calculateCost();
        });
    });
});


$(document).ready(function () {
    // Модальное окно сметы
    const modalInvoce = $('.modal-invoce');
    const modalCalc = $('.modal-calc');
    const modalOverlay = $('.modal__open');

    // Открытие модального окна сметы
    $('.content__button--secondary').on('click', function () {
        modalInvoce.addClass('active');
        modalOverlay.addClass('active'); // Добавляем класс active для фона
    });

    // Открытие модального окна оформления заказа
    $('.content__button--primary').on('click', function () {
        modalCalc.addClass('active');
        modalOverlay.addClass('active'); // Добавляем класс active для фона
    });
    
    // Закрытие модальных окон по клику вне окна
    $(window).on('click', function (e) {
        if ($(e.target).is(modalOverlay)) {
            closeModal(); // Закрываем активное модальное окно и фон
        }
    });

    // Функция для закрытия модальных окон
    function closeModal() {
        $('.modal.active').removeClass('active');
        modalOverlay.removeClass('active');
    }
});

// Закрытие модального окна
function closeModal(modalClass) {
    const modal = $('.' + modalClass); // Выбираем элемент через jQuery
    const modalOverlay = $('.modal__open'); // Выбираем фон через jQuery
    
    if (modal.length) {
        modal.removeClass('active'); // Убираем класс active у модального окна
    }
    
    if (modalOverlay.length) {
        modalOverlay.removeClass('active'); // Убираем класс active у фона
    }
}

// Маска для телефона
$(document).ready(function () {
    $('input[name="phone"]').inputmask({
        mask: "+7(999) 999-99-99",
        placeholder: "_",
        showMaskOnHover: false,
        showMaskOnFocus: true
    });
});