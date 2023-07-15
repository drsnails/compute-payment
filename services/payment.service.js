'use strict'





function computePayment(amount, isPartials) {

    if (amount > 15000000) {
        var isMin
        const limit = 15000000
        const diff = amount - limit
        let res = { value: diff * 0.01, partials: [{ value: diff, percent: 0.01 }] }
        const lastStairRes = computePayment(limit)
        res.value += lastStairRes.value
        res.partials.push(...lastStairRes.partials)
        return { value: res.value, partials: res.partials, isMin }
        ///
        // var isMin
        // let res = amount * 0.01
        // if (res < 53157) {
        //     res = 53157
        //     isMin = true
        // }
        // return { value: res, partials: [{ value: amount, percent: 0.01 }], isMin }
    }

    if (amount > 5000000) {
        var isMin
        const limit = 5000000
        const diff = amount - limit
        let res = { value: diff * 0.02, partials: [{ value: diff, percent: 0.02 }] }
        const lastStairRes = computePayment(limit)
        res.value += lastStairRes.value
        res.partials.push(...lastStairRes.partials)
        return { value: res.value, partials: res.partials, isMin }
        //////
        // var isMin
        // let res = amount * 0.02
        // if (res < 53157) {
        //     res = 53157
        //     isMin = true
        // }
        // return { value: res, partials: [{ value: amount, percent: 0.02 }], isMin }
    }

    if (amount > 1134660) {
        var isMin
        const limit = 1134660
        const diff = amount - limit
        let res = { value: diff * 0.03, partials: [{ value: diff, percent: 0.03 }] }
        const lastStairRes = computePayment(limit)
        res.value += lastStairRes.value
        res.partials.push(...lastStairRes.partials)
        return { value: res.value, partials: res.partials, isMin }
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
        console.log('data', data);
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