
// Budget Controller
var budgetController = (function() {

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.caclPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }    
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type,id){
            var ids,index;
    
            // get id of all items
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            console.log(ids);
            // indext the item we want to delete
            index = ids.indexOf(id);
    
            // delete the item from the array
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){

            // calculate total income and expsenses (private)
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income we spent
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else 
                data.percentage = -1;
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.caclPercentage(data.totals.inc)
            })
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){

            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }

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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        currentMonth: '.budget__title--month'

    }

    var formatNumber = function(number,type){
        var numberSplit,integerNumber,decimalNumber,sign;
        // 1. + or - before number
        // 2. exactly 2 decimal points
        // 3. comma separating the thousands
        
        number = Math.abs(number);
        number = number.toFixed(2);

        numberSplit = number.split('.');

        integerNumber = numberSplit[0];
        if (integerNumber.length > 3) {
            integerNumber = integerNumber.substr(0, integerNumber.length - 3) + ',' + integerNumber.substr(integerNumber.length - 3, 3);
        }

        decimalNumber = numberSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + integerNumber + '.' + decimalNumber;
    };

    var nodeListForEach = function(list,callback){
        for(var i = 0; i<list.length; i ++)
        {
            callback(list[i],i);
        }
    };

    return {
        getinput: function(){

            return {
                // will be either inc or exp
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesctiption).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },  

        addListItem: function(obj, type){
            var html, newHtml, element;
            // 1. Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;

                html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // 2. Replace the placeholder text with some acrual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

            // 3. Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function(){
            var fields;

            fields = document.querySelectorAll(DOMstrings.incomeContainer +','+ DOMstrings.expensesContainer);
            fields.forEach(function(current){
                current.value = "";
            })
        
            //document.querySelector(DOMstrings.inputDesctiption).value = "";
            //document.querySelector(DOMstrings.inputValue).value = "";
        },

        displayBudget: function(obj){
            var type;
            obj.budget >= 0 ? type ='inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(fields, function(current,index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });        
        },
        displayMonth: function(){
            var currentDate, year;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            currentDate = new Date();
            year = currentDate.getFullYear();
            month = currentDate.getMonth();
            document.querySelector(DOMstrings.currentMonth).textContent = months[month-1] + ' ' + year;
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDesctiption + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    }

    var updateBudget = function(){

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function(){

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getinput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add item to budget contoller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem,input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and pdate budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentage();
        }
        
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        //console.log(event.target.parentNode.parentNode.parentNode.parentNode);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log()
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        // 1.Delete the item from the datastructure
        budgetCtrl.deleteItem(type,ID);

        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID);

        // 3. Update and show the new budget
        updateBudget();

        // 4. calculate and update percentages
    }

    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setupEventListeners();
            
        }
    };
    

})(budgetController,UIController);

controller.init();