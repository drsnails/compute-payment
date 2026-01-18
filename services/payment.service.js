'use strict'




function computePayment(amount) {

    if (amount > 16_411_892) return getStairCompute(16_411_892, 0.01, amount)

    if (amount > 5_470_630) return getStairCompute(5_470_630, 0.02, amount)

    if (amount > 1_241_148) {
        const computedSum = getStairCompute(1_241_148, 0.03, amount)
        if (computedSum.value < 58_146) {
            computedSum.value = 58_146
            computedSum.isMin = true
        }
        return computedSum
    }

    if (amount > 126_293) {
        const computedSum = getStairCompute(126_293, 0.04, amount)
        if (computedSum.value < 4_668) {
            computedSum.value = 4_668
            computedSum.isMin = true
        }
        return computedSum
    }

    if (amount > 31_068) return getStairCompute(31_068, 0.1, amount)

    if (amount > 0) return getSimpleTaxCompute({ amount, percent: 0.15, minimum: 935 })
}


function getStairCompute(limit, percent, amount) {
    const diff = amount - limit
    let res = { value: diff * percent, partials: [{ value: diff, percent }] }
    const { value, partials } = computePayment(limit)
    res.value += value
    res.partials.unshift(...partials)
    return { value: res.value, partials: res.partials }
}

function getSimpleTaxCompute({ amount, percent, minimum }) {
    let isMin
    let res = amount * percent
    if (res < minimum) {
        res = minimum
        isMin = true
    }
    return { value: res, partials: [{ value: amount, percent }], isMin }
}


function numberWithCommas(x) {
    x = +x.toFixed(2)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getFormattedPrice(numStr) {

    const num = getNumNoCommas(numStr)
    const newNumStr = num + ''

    const commaCount = Math.ceil(newNumStr.length / 3) - 1
    const digits = newNumStr.split('')

    for (let i = 3; i <= commaCount * 3; i += 3) {
        const commaIdx = newNumStr.length - i
        digits.splice(commaIdx, 0, ',')
    }

    const formattedNum = digits.join('')
    return formattedNum === '0' ? '' : formattedNum
}

function getNumNoCommas(numStr) {
    return +(numStr).replaceAll(',', '').replaceAll('₪ ', '')
}

function hasNonDigitChars(str) {
    const nonDigitExceptCommaRegex = /[^0-9,]/;
    return nonDigitExceptCommaRegex.test(str);
}



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
        onSuccess(data.secure_url)

    } catch (err) {
        console.log(err);
    }
}


async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        throw err
    }

}

