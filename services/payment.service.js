'use strict'





function computePayment(amount) {

    //TODO - Continue updating new values for 5M and 15M
    if (amount > 15_000_000) return getStairCompute(15_000_000, 0.01, amount)

    if (amount > 5_000_000) return getStairCompute(5_000_000, 0.02, amount)

    if (amount > 1_212_532) {
        const computedSum = getStairCompute(1_212_532, 0.03, amount)
        if (computedSum.value < 56_805) {
            computedSum.value = 56_805
            computedSum.isMin = true
        }
       
        return computedSum
    }

    if (amount > 123_387) {
        const limit = 123_387
        const diff = amount - limit
        return { value: limit * 0.1 + diff * 0.04, partials: [{ value: limit, percent: 0.1 }, { value: diff, percent: 0.04 }] }
    }

    if (amount > 30_353) {
        let isMin
        let res = amount * 0.1
        if (res < 4561) {
            res = 4561
            isMin = true
        }
        return { value: res, partials: [{ value: amount, percent: 0.1 }], isMin }
    }
    if (amount > 0) {
        let isMin
        let res = amount * 0.15
        if (res < 914) {
            res = 914
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
        const elMsg = document.querySelector('section.msg')
        elMsg.classList.remove('hide')
        setTimeout(() => {
            elMsg.classList.add('hide')
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
}

