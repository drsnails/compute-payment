'use strict'

navigator.serviceWorker.register('./sw.js')
var gPrevInputValue = ''
var gResult = null
var gIsDetails = false
var gIsModalOpen = false

function onCompute(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('input')
    const amount = getNumNoCommas(elInput.value)
    if (!amount) return
    const res = computePayment(amount)
    renderResult(res)
    gIsModalOpen = false
}


function renderResult(res) {
    const elMsgSpan = document.querySelector('.msg span')
    const elResSpan = document.querySelector('.result span')
    if (!res) {
        elMsgSpan.innerHTML = 'על פי ההסכם לגבי המדרגות הבאות'
        elResSpan.innerHTML = ''
        gResult = null
    } else {
        gResult = res
        elMsgSpan.innerHTML = ''
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
    if (gIsModalOpen) {
        document.querySelector('.partials').classList.add('hidden')
        gIsModalOpen = false
    } else {
        gIsModalOpen = true
        let str = ''

        if (!gResult) return
        if (!gResult.isMin) {
            gResult.partials.forEach((partial, idx) => {
                const plus = idx === gResult.partials.length - 1 ? '' : ' &#43;  '
                str += `<p>&nbsp;${partial.percent * 100}% &#215; ${numberWithCommas(partial.value)}&nbsp;` + plus + '</p>'
            })
        } else {
            // str = `${numberWithCommas(gResult.partials[0].value)} * ${gResult.partials[0].percent*100}% is less than the minimum`
            str = numberWithCommas(gResult.value) + '(minimum)'
        }

        document.querySelector('.partials').innerHTML = str
        document.querySelector('.partials').classList.remove('hidden')
    }


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
    // document.querySelector('.copy-btn-container').classList.remove('hidden')
}


function onShare(to = 'whatsapp') {

    const elLoader = document.querySelector('.loader')
    elLoader.classList.remove('hidden')
    html2canvas(document.body, { ignoreElements: (el) => el.classList.contains('loader') }).then(function (canvas) {
        const imageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        doUploadImg(imageData, (url) => {
            elLoader.classList.add('hidden')
            let urlToShare
            if (to === 'whatsapp') urlToShare = `whatsapp://send?text=${encodeURIComponent(url)}&file=${encodeURIComponent(url)}`
            else if (to ==='gmail') urlToShare = `mailto:?subject=&body=${encodeURIComponent(url)}`
            window.open(urlToShare, "_blank");
        })
    });
}





// services
