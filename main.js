'use strict'

navigator.serviceWorker.register('./sw.js')

var gResult = null

function onCompute(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('input')
    const amount = +elInput.value
    console.log('amount:', amount)
    if (!amount) return
    const res = computePayment(amount)
    renderResult(res)

}

console.log('html2canvas:', html2canvas)

function renderResult(res) {
    gResult = res
    document.querySelector('.result span').innerText = numberWithCommas(res.value)
    showModal()

}

function onShowPartials() {

}

function onRenderPartials() {
    let str = ''
    if (!gResult.isMin) {
        gResult.partials.forEach((partial, idx) => {
            const plus = idx === gResult.partials.length - 1 ? '' : ' +  '
            str += `${partial.percent * 100}% * ${numberWithCommas(partial.value)}` + plus
        })
    } else {
        // str = `${numberWithCommas(gResult.partials[0].value)} * ${gResult.partials[0].percent*100}% is less than the minimum`
        str = numberWithCommas(gResult.value) + ' (minimum)'
    }

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
    document.querySelector('input').value = ''

    gResult = null

}


function onShare() {
    html2canvas(document.body).then(function (canvas) {
        const imageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        doUploadImg(imageData, (url)=>{
            console.log('url:', url)
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(url)}&file=${encodeURIComponent(url)}`
            window.open(whatsappUrl, "_blank");
        })
    });
}





// services


function computePayment(amount) {

    if (amount > 1134660) {

        var isMin
        let res = amount * 0.04
        if (res < 53157) {
            res = 53157
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.04 }], isMin }
    }
    if (amount > 115463) {
        const limit = 115463
        const diff = amount - limit
        return { value: limit * 0.1 + diff * 0.04, partials: [{ value: limit, percent: 0.1 }, { value: diff, percent: 0.04 }] }
    }
    if (amount > 28403) {
        var isMin
        let res = amount * 0.1
        if (res < 4268) {
            res = 4268
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.1 }], isMin }
    }
    if (amount > 0) {
        var isMin
        let res = amount * 0.15
        if (res < 815) {
            res = 815
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.15 }], isMin }
    }
}



function numberWithCommas(x) {
    x = +x.toFixed(2)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// const CLOUD_NAME = 'recipe-gen'

async function doUploadImg(imgData, onSuccess) {
    const CLOUD_NAME = "recipe-gen"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData();
    formData.append('file', imgData)
    formData.append('upload_preset', 'recipe-gen');
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        console.log('data', data);
        onSuccess(data.secure_url)

    } catch (err) {
        console.log(err);
    }
}