'use strict'

navigator.serviceWorker.register('./sw.js')
var gPrevInputValue = ''
var gResult = null
var gIsDetails = false
var gIsModalOpen = true

function onCompute(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('input')
    const amount = getNumNoCommas(elInput.value)
    if (!amount) return
    const res = computePayment(amount)
    renderResult(res)
    // gIsModalOpen = false
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

    gIsModalOpen = true
    showModal()
    handlePartialDisplay()
}


function handlePartialDisplay(elBtn) {
    onRenderPartials()
    if (!elBtn) elBtn = document.querySelector('.btn.details-btn')
    elBtn.innerHTML = gIsModalOpen ? 'הסתר &#x25B2;' : 'פרט &#x25BC;'
    gIsModalOpen = !gIsModalOpen
}


function handleInput(elInput) {
    let res = getFormattedPrice(elInput.value)
    if (res === 'NaN') res = gPrevInputValue
    elInput.value = res || ''
    gPrevInputValue = elInput.value
}

function onRenderPartials() {
    if (!gIsModalOpen) {
        document.querySelector('.partials').classList.add('hidden')
    } else {
        let str = ''

        if (!gResult) return
        if (!gResult.isMin) {
            gResult.partials.forEach((partial, idx) => {
                const plus = idx === gResult.partials.length - 1 ? '' : ' &#43;  '
                str += `<p>&nbsp;${partial.percent * 100}% &#215; ${numberWithCommas(partial.value)}&nbsp;` + plus + '</p>'
            })
        } else {
            // str = `${numberWithCommas(gResult.partials[0].value)} * ${gResult.partials[0].percent*100}% is less than the minimum`
            str = numberWithCommas(gResult.value) + ' (מינימום)'
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



const onCopyUrlToClipboard = async (text = 'https://drsnails.github.io/compute-payment/') => {
    try {
        await copyToClipboard(text)
        flashMsg('כתובת הועתקה בהצלחה')
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
}


async function onCopyResult(elResult) {
    const num = getNumNoCommas(elResult.innerText)
    try {
        await copyToClipboard(num)
        flashMsg('סכום הועתק בהצלחה')
    } catch (err) {
        console.error('Failed to copy: ', err)
    }

}



function flashMsg(msg) {
    const elMsg = document.querySelector('section.msg')
    elMsg.querySelector('span').innerText = msg
    elMsg.classList.remove('hide')
    setTimeout(() => {
        elMsg.classList.add('hide')
    }, 2000);
}


function onShare(to = 'whatsapp') {
    const elLoader = document.querySelector('.loader')
    elLoader.classList.remove('hidden')
    html2canvas(document.body, {
        ignoreElements: (el) => el.classList.contains('loader') || el.classList.contains('share-btns-container') || el.classList.contains('btns') || el.classList.contains('msg')
    }).then(function (canvas) {
        const imageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        doUploadImg(imageData, (url) => {
            elLoader.classList.add('hidden')
            let urlToShare
            if (to === 'whatsapp') urlToShare = `whatsapp://send?text=${encodeURIComponent(url)}&file=${encodeURIComponent(url)}`
            else if (to === 'gmail') urlToShare = `mailto:?subject=&body=${encodeURIComponent(url)}`
            window.open(urlToShare, "_blank");
        })
    });
}





// services
