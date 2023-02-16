import { menuArray } from '/data.js'

let orderArray = []

document.addEventListener('click', function (e) {
    if (e.target.dataset.add) {
        handleOrderItemClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        let itemIndex = orderArray.findIndex((item) => item.id == e.target.dataset.remove)
        orderArray.splice(itemIndex, 1)
        getOrderSummaryHtml()
    } else if (e.target.id === "btn-order") {
        completeOrder()
        const menuAddButtons = document.querySelectorAll('.btn-menu-add');
        const menuRemoveButtons = document.querySelectorAll('.btn-menu-remove')

        for (const addButton of menuAddButtons) {
            // ✅ Set the disabled attribute
            addButton.setAttribute('disabled', '')
        }

        for (const removeButton of menuRemoveButtons) {
            // ✅ Set the disabled attribute
            removeButton.setAttribute('disabled', '')
        }
    }
})

// handle order clicks

function handleOrderItemClick(itemId) {

    let numId = parseInt(itemId, 10)

    const targetItemObj = menuArray.filter(function (item) {
        return item.id === numId
    })[0]

    orderArray.push(targetItemObj)
    getOrderSummaryHtml()
}

// show the menu options

function getMenuHtml() {

    let menuHtml = ``
    menuArray.forEach(function (menuItem) {
        const { emoji, name, ingredients, price, id } = menuItem
        menuHtml += `
        <div class="menu-item-wrapper">
        <div class="menu-item">
            <span class="menu-emoji">${emoji}</span>
            <div class="menu-item-details">
                <h3>${name}</h3>
                <p>${ingredients}</p>
                <h4>$${price}</h4>
            </div>
            <div class="btn-menu-container">
                <button class="btn-menu-add" id="btn-menu-add" data-add="${id}">+</button>
            </div>
        </div>
        </div>
        `

    })
    return menuHtml
}

// show order summary

function getOrderSummaryHtml() {

    let totalOrderPrice = 0;
    let indexPosition = 0;

    for (let i = 0; i < orderArray.length; i++) {
        totalOrderPrice += orderArray[i].price;
    }

    let orderHtml = ``
    let orderSummaryHtml = ``

    if (orderArray.length > 0) {
        document.getElementById('order-container').classList.remove('hidden')
        orderArray.forEach(function (item) {
            const { name, price, id } = item
            orderHtml += `
            <div class="order-details">
                <div class="order-item">
                    <h3>${name}</h3>
                    <button class="btn-menu-remove" id="btn-menu-remove" data-remove="${id}">Remove</button>
                </div>
                <h4>$${price}</h4>
            </div>
            `
        })

        orderSummaryHtml = `
        <div class="order-summary">
            <h3>Your Order</h3>
            <div>${orderHtml}</div>
            <div class="order-divider"></div>
            <div class="order-total">
                <h3>Total price</h3>
                <h4>$${totalOrderPrice}</h4>
        </div>
        <button class="btn-order" id="btn-order">Complete Order</button>
    `
    } else if (orderArray.length === 0) {
        document.getElementById('order-container').classList.add('hidden')
    }
    document.getElementById('order-container').innerHTML = orderSummaryHtml
}

// complete order and show order form / success message

function completeOrder() {
    const modal = document.getElementById('modal')
    const orderForm = document.getElementById('order-form')

    modal.style.display = 'inline'

    orderForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const orderFormData = new FormData(orderForm);
        const fullName = orderFormData.get("full-name");
        showStatus(fullName)
    })
}

function showStatus(fullName) {
    const submitBtn = document.getElementById('submit')
    submitBtn.innerHTML = `
        <img src="images/loading.svg" class="loading">
        `
    setTimeout(function () {
        modal.style.display = 'none'
        document.getElementById('order-container').classList.add('success')
        document.getElementById('order-container').innerHTML =
            `<h4>Thanks ${fullName}! Your order is on its way.</h4>`
    }, 1500)
}

function render() {
    document.getElementById('menu-container').innerHTML = getMenuHtml()
}

render()