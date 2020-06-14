
// Budget Controller
var budgetController = (function() {

    

})();


// UI Controller
var UIController = (function() {

    var DOMstrings = {

        inputType : '.add__type',
        inputDesctiption : '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

    }

    return {
        getinput: function(){

            return {
                // will be either inc or exp
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesctiption).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();


// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
        
            if(event.keycode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }

        });
    }

    var ctrlAddItem = function() {

        // 1. Get the field input data
        var input = UICtrl.getinput();
        console.log(input);

        // 2. Add item to budget contoller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget
    }

    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };
    

})(budgetController,UIController);

controller.init();