'use strict'
var gResult = null

function onCompute() {

    const elInput = document.querySelector('input')
    const amount = +elInput.value
    const res = computePayment(amount)
    renderResult(res)

    document.querySelector('input').value = ''
}

function renderResult(res) {
    gResult = res
    document.querySelector('.result span').innerText = numberWithCommas(res.value)
    showModal()

}

function onShowPartials() {

}

function onRenderPartials() {
    let str = ''
    gResult.partials.forEach((partial, idx) => {
        const plus = idx === gResult.partials.length - 1 ? '' : ' + '
        str += `${numberWithCommas(partial.value)} * ${partial.percent * 100}%` + plus
    })

    document.querySelector('.partials').innerText = str
    document.querySelector('.partials').classList.remove('hidden')

}


function showModal() {
    const elModal = document.querySelector('.result-modal')
    elModal.classList.remove('hidden')
    elModal.querySelector('.partials').classList.add('hidden')
}

function hideModal() {
    const elModal = document.querySelector('.result-modal')
    elModal.classList.add('hidden')
    elModal.querySelector('.result span').innerText = ''
    gResult = null

}



function computePayment(amount) {

    if (amount > 1077855) {
        amount = Math.max(amount * 0.04, 50496)
        return { value: amount, partials: [{ value: amount, percent: 0.04 }] }
    }
    if (amount > 109682) {
        const limit = 109682
        const diff = amount - limit
        return { value: limit * 0.1 + diff * 0.04, partials: [{ value: limit, percent: 0.1 }, { value: diff, percent: 0.04 }] }
    }
    if (amount > 26981) {
        return { value: Math.max(4054, amount * 0.1), partials: [{ value: amount, percent: 0.1 }] }
    }
    if (amount > 0) {
        return { value: Math.max(812, amount * 0.15), partials: [{ value: amount, percent: 0.15 }] }
    }
}


function numberWithCommas(x) {
    x = +x.toFixed(2)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}