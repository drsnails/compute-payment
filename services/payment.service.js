'use strict'





function computePayment(amount) {
    if (amount > 15000000) return getStairCompute(15000000, 0.01, amount)

    if (amount > 5000000) return getStairCompute(5000000, 0.02, amount)

    if (amount > 1134660) return getStairCompute(1134660, 0.03, amount)

    if (amount > 115463) {
        const limit = 115463
        const diff = amount - limit
        return { value: limit * 0.1 + diff * 0.04, partials: [{ value: limit, percent: 0.1 }, { value: diff, percent: 0.04 }] }
    }

    if (amount > 28403) {
        let isMin
        let res = amount * 0.1
        if (res < 4268) {
            res = 4268
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.1 }], isMin }
    }
    if (amount > 0) {
        let isMin
        let res = amount * 0.15
        if (res < 815) {
            res = 815
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.15 }], isMin }
    }
}


function getStairCompute(limit, percent, amount) {
    const diff = amount - limit
    let res = { value: diff * percent, partials: [{ value: diff, percent }] }
    const { value, partials } = computePayment(limit)
    res.value += value
    res.partials.unshift(...partials)
    return { value: res.value, partials: res.partials }
}

function numberWithCommas(x) {
    x = +x.toFixed(2)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getFormattedPrice(numStr) {
    // Remove commas
    const num = getNumNoCommas(numStr)
    const newNumStr = num + ''

    // Calculate the number of commas to insert
    const commaCount = Math.ceil(newNumStr.length / 3) - 1
    const digits = newNumStr.split('')

    // Insert commas every three digits from the right
    for (let i = 3; i <= commaCount * 3; i += 3) {
        const commaIdx = newNumStr.length - i
        digits.splice(commaIdx, 0, ',')
    }

    // Return the newly formatted number or an empty string if the number is zero
    const formattedNum = digits.join('')
    return formattedNum === '0' ? '' : formattedNum
}

function getNumNoCommas(numStr) {
    return +(numStr).replaceAll(',', '')
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


const copyUrlToClipboard = async (text = 'https://drsnails.github.io/compute-payment/') => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
}

