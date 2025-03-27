'use strict'






function unitTesting(options) {
    const { func, inputs, expected } = options
    console.time('Time')
    const res = func(...inputs)
    const isPassed = JSON.stringify(res) === JSON.stringify(expected)
    console.group(func.name)
    console.log(`%c${isPassed ? '✅ PASSED ✅' : '❗️FAILED❗️'}`, `color: ${isPassed ? 'lime' : 'orangered'}`)
    console.log(
        'INPUT:', ...inputs,
        '\nEXPECTED:', expected,
        '\nACTUAL:', res
    )
    console.timeEnd('Time')
    console.groupEnd(func.name)
    console.log('')
}

unitTesting({
    func: computePayment,
    inputs: [3500],
    expected: {
        "value": 914,
        "partials": [
            {
                "value": 3500,
                "percent": 0.15
            }
        ],
        "isMin": true
    }
})

unitTesting({
    func: computePayment,
    inputs: [31_000],
    expected: {
        "value": 4561,
        "partials": [
            {
                "value": 31000,
                "percent": 0.1
            }
        ],
        "isMin": true
    }
})

unitTesting({
    func: computePayment,
    inputs: [95_000],
    expected: {
        "value": 9500,
        "partials": [
            {
                "value": 95000,
                "percent": 0.1
            }
        ]
    }
})


unitTesting({
    func: computePayment,
    inputs: [140_000],
    expected: {
        "value": 13003.220000000001,
        "partials": [
            {
                "value": 123387,
                "percent": 0.1
            },
            {
                "value": 16613,
                "percent": 0.04
            }
        ]
    }
})

unitTesting({
    func: computePayment,
    inputs: [1_230_000],
    expected: {
        "value": 56805,
        "partials": [
            {
                "value": 123387,
                "percent": 0.1
            },
            {
                "value": 1089145,
                "percent": 0.04
            },
            {
                "value": 17468,
                "percent": 0.03
            }
        ],
        "isMin": true
    }
})

unitTesting({
    func: computePayment,
    inputs: [1_400_000],
    expected: {
        "value": 61528.54,
        "partials": [
            {
                "value": 123387,
                "percent": 0.1
            },
            {
                "value": 1089145,
                "percent": 0.04
            },
            {
                "value": 187468,
                "percent": 0.03
            }
        ]
    }
})

unitTesting({
    func: computePayment,
    inputs: [14_000_000],
    expected: {
        "value": 349528.54,
        "partials": [
            {
                "value": 123387,
                "percent": 0.1
            },
            {
                "value": 1089145,
                "percent": 0.04
            },
            {
                "value": 3787468,
                "percent": 0.03
            },
            {
                "value": 9000000,
                "percent": 0.02
            }
        ]
    }
})
unitTesting({
    func: computePayment,
    inputs: [24_000_000],
    expected: {
        "value": 459528.54,
        "partials": [
            {
                "value": 123387,
                "percent": 0.1
            },
            {
                "value": 1089145,
                "percent": 0.04
            },
            {
                "value": 3787468,
                "percent": 0.03
            },
            {
                "value": 10000000,
                "percent": 0.02
            },
            {
                "value": 9000000,
                "percent": 0.01
            }
        ]
    }
})

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

    if (amount > 123_387) return getStairCompute(123_387, 0.04, amount)

    if (amount > 30_353) return getSimpleTaxCompute({ amount, percent: 0.1, minimum: 4561 })

    if (amount > 0) return getSimpleTaxCompute({ amount, percent: 0.15, minimum: 914 })
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

