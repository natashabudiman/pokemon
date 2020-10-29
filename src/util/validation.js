/**
 * Email validation
 * @param {String} email email to test
 */
export function validateEmail(email) {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return email != null && !re.test(email)
}

export function validateTimeGap(value) {
    // eslint-disable-next-line
    let regex = /(((2{1}[0-3]{1}){1}|([0-1]{1}[0-9]){1}):([0-5]{1}[0-9]{1}){1})(( )-( ))(((2{1}[0-3]{1}){1}|([0-1]{1}[0-9]){1}):([0-5]{1}[0-9]{1}){1}){1}$/g
    return value !== null && !regex.test(value)
}

/**
 * Validate max length
 * @param {String} str String to test
 * @param {Number} maxLength Max Length
 */
export function maxLength(str, maxLength) {
    return str != null && str.length >= maxLength;
}

/**
 * Validate Min Length
 * @param {String} str String to test
 * @param {Number} minLength Min Length
 */
export function minLength(str, minLength) {
    return str != null && str.length < minLength;
}

/**
 * Validate is empty
 * @param {String} str String to test
 */
export function isEmpty(str) {
    return str == null || str.length === 0
}

export function numberOnly(str) {
    return str !== null && isNaN(Number(str))
}