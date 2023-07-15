'use strict'

navigator.serviceWorker.register('./sw.js')
var gPrevInputValue = ''
var gResult = null

function onCompute(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('input')
    const amount = getNumNoCommas(elInput.value)
    console.log('amount:', amount)
    if (!amount) return
    const res = computePayment(amount)
    renderResult(res)

}


function renderResult(res) {
    const elResSpan = document.querySelector('.result span')
    if (!res) elResSpan.innerHTML = 'על פי ההסכם לגבי מדרגות הבאות'
    else {
        gResult = res
        elResSpan.innerHTML = '&#8362; ' + numberWithCommas(res.value)
    }
    showModal()

}


function handleInput(elInput) {
    let res = getFormattedPrice(elInput.value)
    if (res === 'NaN') res = gPrevInputValue
    elInput.value = res || ''
    gPrevInputValue = elInput.value
}

function onRenderPartials() {
    let str = ''
    if (!gResult.isMin) {
        gResult.partials.forEach((partial, idx) => {
            const plus = idx === gResult.partials.length - 1 ? '' : ' &#43;  '
            str += `&nbsp;${partial.percent * 100}% &#215; ${numberWithCommas(partial.value)}&nbsp;` + plus
        })
    } else {
        // str = `${numberWithCommas(gResult.partials[0].value)} * ${gResult.partials[0].percent*100}% is less than the minimum`
        str = numberWithCommas(gResult.value) + '(minimum)'
    }

    document.querySelector('.partials').innerHTML = str
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
    document.querySelector('input').value = ''
    gResult = null

}


function onShare() {
    html2canvas(document.body).then(function (canvas) {
        const imageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        doUploadImg(imageData, (url) => {
            console.log('url:', url)
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(url)}&file=${encodeURIComponent(url)}`
            window.open(whatsappUrl, "_blank");
        })
    });
}





// services
