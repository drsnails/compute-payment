/**
* @param {any[]} values
*/
function print(...values) {
    const err = getErrorObject();
    let callerLocationStr = getFormatCallLocation(err)
    const sep = ' '
    let textToShow = values.reduce((str, value, idx) => {
        if (typeof value === 'object') {
            value = JSON.stringify(value).replace(/,/g, ', ')
            value = value.replace(/"[a-zA-Z0-9_]+":/g, match => match.split('"')[1] + ': ')
        }
        value = idx ? sep + value : value
        str += (value + '').replace(/ /g, '&nbsp')
        return str
    }, '')
    document.querySelector('.print-board').innerHTML += ('<li> <span class=value>' + textToShow + '</span>  <span class=location>' + callerLocationStr + '</span></li>')
}

function clear() {
    document.querySelector('.print-board').innerHTML = ''
}

/**
* change the font size
* @param {string} size font size, default: 30
* @param {string} unit font size unit, default: px
*/
function fontSize(size = '20', unit = 'px') {
    document.querySelector('.print-board').style.fontSize = size + unit
}

/**
* set font color
* @param {string} color font color, default: black
*/
function setColor(color = '#000') {
    document.querySelector('.print-board').style.color = color
}

function getErrorObject() {
    try { throw Error('') } catch (err) { return err; }
}

/**
 * @param {Error} err
 * @return {string} print invoke location
 */
function getFormatCallLocation(err) {
    const stackCalls = err.stack.split('at ')
    // Not including first 3 stack calls (Error ==> getErrorObject ==> print)
    const nestedStackCalls = stackCalls.slice(3)
    const callerStackCall = nestedStackCalls[0]
    const lastSlashIdx = callerStackCall.lastIndexOf('/')
    const lastColonIdx = callerStackCall.lastIndexOf(':')
    const res = callerStackCall.slice(lastSlashIdx + 1, lastColonIdx)
    return res
}
