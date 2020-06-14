
// Budget Controller
var budgetController = (function() {

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function(type,des,val) {

            var newItem,ID;

            // Create new Id
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            else
                ID = 0;

            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            } else if(type==='inc'){
                newItem = new Income(ID, des,val);
            }
            
            // Push newitem into data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
    }
        

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
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getinput();

        // 2. Add item to budget contoller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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