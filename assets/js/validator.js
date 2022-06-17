
function Validator(options) {
    const formElement = document.querySelector(options.form);
    selectorRules = {};
    // validate the input
    function validate(inputElement, rule) {
        const parentElement = inputElement.parentElement;
        let rules = selectorRules[rule.selector];
        console.log(rules);
        let errMsg = "" ;
        for (let i = 0 ; i< rules.length; i++) {
            errMsg = rules[i](inputElement.value);
            if (errMsg) break;
        }       

        if (errMsg) {
            parentElement.querySelector(options.errorSelector).innerText = errMsg;
            inputElement.classList.add('form-invalid');
        } else {
            parentElement.querySelector(options.errorSelector).innerText = '';
            inputElement.classList.remove('form-invalid');
        }

        return !errMsg;
    }

    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();
            let formError = false;
            options.rules.forEach(function(rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isError = validate(inputElement,rule);
                if (!isError) {
                    formError = true;
                }
            })

            if (!formError) {
                if (typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');
                    let formValues = Array.from(enableInputs).reduce(function(values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});


                    options.onSubmit(formValues)
                }
                // submit with default html
                else {
                    formElement.submit();
                }

            }

        }

        options.rules.forEach(function(rule) {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement,rule);
                }
                inputElement.oninput = function () {
                    inputElement.parentElement.querySelector(options.errorSelector).innerText = '';
                }
            }
        })
        
    } else {

    }
}


// Identified rules
// What is rule?
// 1. When error => return error message
// 2. When valid => return none 
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Please enter value!!!";
        }
    };
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            return regex.test(value) ? undefined : message || "Please enter valid email";
        }
    };
}

Validator.minLength = (selector, min, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value.length>= min ? undefined : message || `Please enter more than ${min} character`;
        }
    }
}

Validator.isConfirm = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: function (value) {
            return value == getConfirmValue() ? undefined : message || 'The password is not the same';
        }
    }
}