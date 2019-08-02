

        // BUDGET CONTROLLER 
        var budgetController = (function() {

          var Expense = function(id, description, value ) {

              this.id = id;
              this.description = description;
              this.value = value;
              this.percentage = -1;
          };


            Expense.prototype.calcPercentage = function(totalIncome){

                if (totalIncome > 0) {

                this.percentage = Math.round((this.value / totalIncome) * 100);
                } else {
                    this.percentage = -1;
                }

            };
            Expense.prototype.getPercentages = function() {
                return this.percentage;
            };


            var Income = function(id, description, value ) {

              this.id = id;
              this.description = description;
              this.value = value;
          };

            var calculateTotal = function(type) {
                var sum = 0;
                data.allItems[type].forEach(function(cur) {
                     sum+=cur.value;                      
                             });

                data.totals[type] = sum;

                };





            var totalExpenses = 0;



            var data = {
            allItems: {


             exp: [],
             inc: []  

            },
                totals: {
                    exp:0,
                    inc:0
                },
                budget: 0,
                percentage: -1
            };

            return {
                addItem: function(type, des, val) {

                    var newItem;

                    // Cria ID nova
                    if (data.allItems[type].length > 0) {
                                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1

                    } else {
                        ID = 0;
                    }


                    // Cria novo item baseado no type inc ou exp
                    if (type === 'exp') {

                   newItem = new Expense(ID, des, val);

                    } else if(type === 'inc'){
                        newItem = new Income (ID, des, val);
                    }


                    // alocado dentro da estrutura de dado
                    data.allItems [type].push(newItem);



                    // Retorna um elemento novo
                    return newItem;
                },


                deleteItem: function(type, id) {
                var ids, index;


                // id = 3
               ids = data.allItems[type].map(function(current){

                     return current.id;
                               });



                   index = ids.indexOf(id);

                   if(index !== -1 ){
                       data.allItems[type].splice(index, 1);



                   }






            },
                calculateBudget: function(){


                    // Calcular total income e expenses

                    calculateTotal('exp');
                    calculateTotal('inc');




                    // Calcular o budget: income - expenses


                    data.budget = data.totals.inc - data.totals.exp;


                    // Calcular a porcentagem de income que gastamos

                    if(data.totals.inc > 0 ){
                                        data.percentage =  Math.round((data.totals.exp / data.totals.inc) * 100);

                    }else {

                     data.percentage = -1;

                    }

                },


                calculatePercentages: function(){

                    data.allItems.exp.forEach(function(cur){
                        cur.calcPercentage(data.totals.inc);


                    });
                },

                getPercentages: function() {
                    var allPerc = data.allItems.exp.map(function(cur){
                        return cur.getPercentages();


                    });
                    return allPerc;

                },

                getBudget: function() {
                    return {
                        budget: data.budget,
                        totalInc: data.totals.inc,
                        totalExp: data.totals.exp,
                        percentage: data.percentage
                    };
                },
                testing: function(){
                    console.log(data);
                }
            };




        })();









        // UI CONTROLLER
        var UIController = (function() {


            // Elementos HTML
            var DOMstrings = {
                inputType: '.add__type',
                inputDescription: '.add__description',
                inputValue: '.add__value',
                inputBtn: '.add__btn',
                incomeContainer: '.income__list',
                expensesContainer: '.expenses__list',
                budgetLabel: '.budget__value',
                incomeLabel: '.budget__income--value',
                expensesLabel: '.budget__expenses--value',
                percentageLabel: '.budget__expenses--percentage',
                container: '.container',
                expensesPercLabel:'.item__percentage',
                dataLabel: '.budget__title--month'



            };

           var formatNumber = function(num, type){
                    var numSplit, int , dec;

                    /*
                    + ou - antes do numer
                    2 casas decimais
                    virgulha separando os milhares

                    2310.4567 = + 2,310.46
                    */

                    num = Math.abs(num);

                    // formata numeros, transformado os numeros em string/objetos
                    num = num.toFixed(2);

                    numSplit = num.split ('.');

                    int = numSplit [0];
                    if (int.length > 3){
                      int =  int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //entrada 23510, saida 23,510

                    }

                    dec = numSplit[1];
                   return  (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;

                };

            var NodeListForEach = function(list, callback){
                        for (var i = 0; i < list.length; i++){
                            callback(list[i], i);
                        }
                    };


            return {
                getinput: function() {
                    return {
                     type: document.querySelector(DOMstrings.inputType).value, // Será inc or exp
                     description: document.querySelector(DOMstrings.inputDescription).value,
                     value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

                    };

                },


                addListItem: function(obj, type) {
                    var html, newHtml;
                    // Criar string HTML com texto placeholder


                    if (type === 'inc') {

                    element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    } else if (type === 'exp') {

                    element = DOMstrings.expensesContainer;
                   html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                    }
                    // trocar o texto placeholder por data atual
                    newHtml = html.replace('%id%', obj.id);
                    newHtml = newHtml.replace('%description%', obj.description);
                    newHtml = newHtml.replace('%value%',formatNumber(obj.value));



                    // inserir o HTML na DOM
                     document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


                },

                //Delete item da lista

                deleteListItem: function(selectorID){
                   var el = document.getElementById(selectorID);
                   el.parentNode.removeChild(el);
                },


                // Limpar campos

                clearFields: function(){
                    var fields, fieldsArr;


                  fields =   document.querySelectorAll(DOMstrings.inputDescription +', ' + DOMstrings.inputValue);


                fieldsArr = Array.prototype.slice.call(fields);
                fieldsArr.forEach(function(current, index, array){
                    current.value ="";





                });
                    fieldsArr[0].focus();
                },


                displayBudget: function(obj){
                    var type;
                    obj.budget > 0 ? type = 'inc' : type = 'exp';


                    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                    document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


                    if(obj.percentage > 0 ){
                        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

                    } else {
                        document.querySelector(DOMstrings.percentageLabel).textContent = 
                                            '---';
                    }




                },

                displayPercentages: function(percentages){

                    var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


                    NodeListForEach(fields, function(current, index){

                        if (percentages[index] > 0) {


                    current.textContent = percentages[index] + '%';
                        } else {
                            current.textContent = '---';
                        }
                                    });

                },

                displayMonth: function() {
                    var now, year, month;

                     now = new Date();

                    months =['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                    month = now.getMonth();

                    year = now.getFullYear();

                    document.querySelector(DOMstrings.dataLabel).textContent = months[month] + ' ' + year;

                },

                changedType: function() {
                    var fields = document.querySelectorAll(
                    DOMstrings.inputType + ',' +
                    DOMstrings.inputDescription + ',' +
                    DOMstrings.inputValue);


                   NodeListForEach(fields, function(cur){


                    cur.classList.toggle('red-focus');
                   });


                    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');



                },

                getDOMstrings: function() {
                    return DOMstrings;
                }
            };



        })();









        //GLOBAL APP CONTROLLER




        var controller = (function(budgetCrtl, UICrtl) {

            var setupEventListeners = function() {

            var DOM = UICrtl.getDOMstrings();          

            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);




            document.addEventListener('keypress', function(event) {


                if (event.keyCode === 13 || event.which === 13) {

                    ctrlAddItem();


                }


            });


                // Event babbling
                document.querySelector(DOM.container).addEventListener('click', crtlDeleteItem);
                 document.querySelector(DOM.inputType).addEventListener('change', UICrtl.changedType);

            };


            var updateBudget = function(){

                     // 1. calcular o budget
                budgetCrtl.calculateBudget();

                    // 2. retornar o budget

                var budget = budgetCrtl.getBudget();

                    // 3. mostrar o budget na UI
                UICrtl.displayBudget(budget);            
            };



            var updatePercentages = function(){

                // 1. Calcular porcentagens
                budgetCrtl.calculatePercentages();

                // 2. ler porcentagens pelo budget controller

               var percentages = budgetCrtl.getPercentages();
                // 3. Atualizar a UI com a nova porcentagem

            UIController.displayPercentages(percentages);

            }




            var ctrlAddItem = function() {

                var input, newItem;

                // 1. pegar data do campo input
                var input = UICrtl.getinput();



                    if(input.description !=="" && !isNaN(input.value) && input.value > 0) {



                // 2. add item para o budget controller

                newItem = budgetCrtl.addItem(input.type, input.description, input.value)

                // 3. add item para a UI

               UICrtl.addListItem(newItem, input.type);

                // 4 limpar os campos


                UICrtl.clearFields();

                // 5. Calcular e atualizar budget

                updateBudget();


                // 6. Calcular e atualizar porcentagem
                updatePercentages();

                    }





                          };
            var crtlDeleteItem = function(event){
                var itemID, splitID, type;



                // Chegando ao HTML do id
               itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

                if(itemID){
                   // inc-1
                    splitID = itemID.split('-');
                    type = splitID[0];
                    ID = parseInt(splitID[1]);

                    // 1. Remover o item da estrutura de dadoss


                    budgetCrtl.deleteItem(type, ID);


                    // 2. Remover item da UI
                    UICrtl.deleteListItem(itemID);

                    // 3. Atualizar e mostrar novo budget
                                updateBudget();


                    // 4. Calcular e atualizar porcentagens
                    updatePercentages();

                }

            };

        return {
            init: function(){
                console.log("Appllication has started.");
                UICrtl.displayMonth();
                UICrtl.displayBudget({
                        budget: 0,
                        totalInc: 0,
                        totalExp: 0,
                        percentage: -1
                    });            

                setupEventListeners();
            }
        };


        })(budgetController, UIController);


        controller.init();

