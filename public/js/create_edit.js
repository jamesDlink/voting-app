var answers =[];
window.onload = function(){
    

    var btnAddAnswer = document.getElementById("add-answer"),
        inputAnswer = document.getElementById("input-answer"),
        answerContainer = document.getElementById("answer-container"),
        answerItems = document.getElementsByClassName("answer-item"),
        btnSubmit = document.getElementById("submit-button"),
        form = document.getElementById("poll-form"),
        name_input = document.getElementById('name-input'),
        creator_input = document.getElementById('creator-input');

    //Update button listener answers
    updateAnswers();
    
    //Add new answer items to the container.
    btnAddAnswer.addEventListener("click",function(){
        var text = inputAnswer.value;
        if(text!="" && text.length<20 && answers.indexOf(text)==-1){
            var li = document.createElement('li');
            var domString = '<li><div class="answer-item mb-4"><div class="answer-text d-inline"><span>'+text+'</span></div><div class="d-inline"><a class="btn delete-answer-button"><i class="fas fa-minus-circle"></i></a></div></div></li>';
            li.innerHTML = domString;
            answerContainer.appendChild(li);
            inputAnswer.value = "";
            updateAnswers();
        }
    })
    
    
    
    //Form validation
    function isValidForm(){
            if(!name_input.value||answers.length<=1){
            return false;
        }else{
            return true;
        }
    }
    
    form.onsubmit = function(){
        return isValidForm();
    }
    
    
    btnSubmit.addEventListener("click",function(){
        //Validation
        if(!isValidForm()){
            alert("Name cannot be empty.");
            return;
        }
        
        //Create a hidden input to send the answers data with the form.
        
        var input = document.createElement('input');
        input.type = "hidden";
        input.name = "poll[answers]";
        
        //Set input's value
        if(answers.length>0)
            input.value = answers;
        else
            input.value = "";
        //Append input
        form.appendChild(input);
        //Disable send button to prevent multiple data being sent.
        btnSubmit.disabled = true;
        //Submit form.
        form.submit();
    })
    
    
    function updateAnswers(){
        
        //For each answer item , I create a new one with a new event listener.
        
        answerItems = document.getElementsByClassName("answer-item");
        for(var i = 0 ; i<answerItems.length;i++){
            
        //Replace to remove old listener.
        var oldElement = answerItems[i];
        var newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement,oldElement);
        
        //Insert new event listener
        var text = newElement.children[0].textContent;
        var btnDelete = newElement.children[1];
        btnDelete.addEventListener("click",deleteAnswer(newElement,text));
        
        //Add to answers array
        if(answers.indexOf(text)==-1)
            answers.push(text.toString());
    }
    
    //Disable submit button until there is at least two answers in the poll.
    if(answers.length>1){
        btnSubmit.disabled = false;
    }else{
        btnSubmit.disabled = true;
    }
        
    }
    
    //Delete the element and remove it from answers array.
    function deleteAnswer(element,text){
        return function(){
        element.parentNode.remove();
        var index = answers.indexOf(text);
        answers.splice(index,1);
        }
    }
    
    
}