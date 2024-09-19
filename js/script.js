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

let rooms = [
    { id: 1, area: 10, corners: 4, texture: 'pvc', color: 'white' }
];

let counterRoom = 1;
let currentRoom = 1;
const maxRooms = 5;

function calculateTotalCost() {
    let totalPrice = 0;
    let roomsHtml = '';

    rooms.forEach(({ area, corners, texture, color, id }) => {
        if (texture === 'fabric') return;

        let pricePerSqm = data.prices[texture][color];
        let roomPrice = pricePerSqm * area + data.prices.corner_price * corners;
        totalPrice += roomPrice;

        roomsHtml += `
        <div class="room" data-room="${id}" style="display: block;">
            <input type="hidden" name="room-${id}-square" value="${area}">
            <input type="hidden" name="room-${id}-corners" value="${corners}">
            <input type="hidden" name="room-${id}-invoice" value="${texture}">
            <input type="hidden" name="room-${id}-color" value="${color}">
            <input type="hidden" name="room-${id}-total" value="${roomPrice}">
            <p class="title">Комната №${id} (<span class="square">${area}</span> м²)</p>
            <p>Стоимость: <span class="price">${roomPrice.toLocaleString()}</span> руб.</p>
        </div>`;
    });

    $('#result-calc').html(`
        ${roomsHtml}
        <p class="total">Итого: <span>${totalPrice.toLocaleString()}</span> руб.</p>
        <p class="additionally">* Ориентировочная стоимость. Детальный расчет уточнять у менеджера</p>
    `);

    $('#result').text(`Стоимость натяжного потолка: ${totalPrice.toLocaleString()} руб`);

    const currentRoomObj = rooms.find(room => room.id === currentRoom);
    if (currentRoomObj?.texture === 'fabric') {
        $('#result').text('Нет в наличии');
    }
}


// Функция обновления данных комнаты
function updateRoom(roomId, field, value) {
    const room = rooms.find(r => r.id === roomId);
    if (room && room[field] !== value) {
        room[field] = value;
        calculateTotalCost();
    }
}

// Функция добавления комнаты
function addRoom() {
    if (rooms.length >= maxRooms) return;

    const newRoom = {
        id: ++counterRoom,
        area: 10,
        corners: 4,
        texture: 'pvc',
        color: 'white'
    };

    rooms.push(newRoom);
    createRoomTab(newRoom);
    calculateTotalCost();

    if (rooms.length === maxRooms) {
        $('.navigation__btn--add').hide();
    }
}

// Функция создания вкладки комнаты
function createRoomTab(room) {
    const roomTab = `
        <button class="navigation__btn" data-room-id="${room.id}">
            №${room.id}
            <span class="remove-room" data-room-id="${room.id}">×</span>
        </button>
    `;

    $(roomTab).insertBefore('.navigation__btn--add');
    selectRoom(room.id);
}


// Функция выбора комнаты
function selectRoom(roomId) {
    let room = rooms.find(r => r.id === roomId);
    if (!room) return;

    $('.navigation__btn').removeClass('navigation__btn--selected');
    $(`.navigation__btn[data-room-id="${roomId}"]`).addClass('navigation__btn--selected');

    const { area, corners, texture, color } = room;

    $('#area').val(area);
    $('#corners').val(corners);
    $('#texture').val(texture);
    $('#color').val(color);

    currentRoom = roomId;
    calculateTotalCost();
}

// Функция удаления комнаты
function removeRoom(roomId) {
    if (roomId === 1) return;

    rooms = rooms.filter(r => r.id !== roomId);
    $(`.navigation__btn[data-room-id="${roomId}"]`).remove();

    if (rooms.length < maxRooms) {
        $('.navigation__btn--add').show();
    }

    counterRoom--;

    selectRoom(currentRoom === roomId ? 1 : currentRoom);
}

$(document).on('click', '.content__btn--plus, .content__btn--minus', function() {
    let $input = $(this).siblings('input');
    let value = parseInt($input.val());
    let limit = parseInt($input.attr($(this).hasClass('content__btn--plus') ? 'max' : 'min'));

    value += $(this).hasClass('content__btn--plus') ? 1 : -1;

    if ((value <= limit && $(this).hasClass('content__btn--plus')) ||
        (value >= limit && $(this).hasClass('content__btn--minus'))) {
        $input.val(value).trigger('input');
    }
});

$(document).ready(function() {
    $(document).on('input change', '#area, #corners, #texture, #color', function() {
        let roomId = $('.navigation__btn--selected').data('room-id');
        if (roomId) {
            updateRoom(roomId, this.id, $(this).val());
        }
    });

    // Добавление новой комнаты
    $(document).on('click', '.navigation__btn--add', addRoom);

    // Удаление комнаты
    $(document).on('click', '.remove-room', function(e) {
        e.stopPropagation();
        let roomId = $(this).data('room-id');
        removeRoom(roomId);
    });

    // Выбор комнаты по клику на таб
    $(document).on('click', '.navigation__btn', function() {
        selectRoom($(this).data('room-id'));
    });

    const modalOverlay = $('.modal__open');
    $('.content__button--secondary').on('click', () => openModal('modal-invoce'));
    $('.content__button--primary').on('click', () => openModal('modal-calc'));

    $(window).on('click', (e) => {
        if ($(e.target).is(modalOverlay)) closeModal();
    });

    selectRoom(1);
});

// Функция открытия модального окна
function openModal(modalClass) {
    $(`.${modalClass}`).addClass('active');
    $('.modal__open').addClass('active');
}

// Функция закрытия модальных окон
function closeModal() {
    $('.modal.active').removeClass('active');
    $('.modal__open').removeClass('active');
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
