
function Validator(options) {
    const formElement = document.querySelector(options.form);
    selectorRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            console.log(element.parentElement);
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }

    // validate the input
    function validate(inputElement, rule) {
        const parentElement = getParent(inputElement, options.formGroupSelector);
        // const parentElement = inputElement.parentElement;
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
                        switch (input.type) {
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'radio':
                                if (input.matches(':checked')) {
                                (values[input.name] = input.value);
                                }
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;

                            default:
                                (values[input.name] = input.value);
                        }

                        return values;
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

            let inputElements = formElement.querySelectorAll(rule.selector);
            console.log(inputElements);
            Array.from(inputElements).forEach(function(inputElement) {
                console.log(inputElement)
                if (inputElement) {
                    inputElement.onblur = function () {
                        console.log('blur')
                        validate(inputElement,rule);
                    }
                    inputElement.oninput = function () {
                        inputElement.parentElement.querySelector(options.errorSelector).innerText = '';
                    }
                }
            });
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