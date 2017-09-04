console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "todos_list_div";
const NEW_TODO_INPUT_ID = "new_todo_input";


window.onload = getTodosAJAX();
// AJAX - xmlhttprequest object
// make requests to the server
// 1. without reloading the webpage
// 2. asynchronously

var TODO,flag =false;
var xhr,data;

//var comp = document.getElementById("complete-visibility");
//comp.setAttribute("onclick","Hide("complete-visibility")");

//var comp2 = document.getElementById("delete-visibility");
//comp2.setAttribute("onclick","Hide2("+ comp2 +")");

function Hide() {

   // console.log("hiiiii");
    var temp = document.getElementById("outer-completed-todos");
    //if(document.getElementById("completed-todos").style.display == "block"){
       // temp.innerHTML ="Show Completed Items";
        document.getElementById("completed-todos").style.display = "none";
       // console.log("in loop");
    //}
    //else if(document.getElementById("completed-todos").style.display == "none"){
      //  temp.innerText ="Show Completed Items";
       // document.getElementById("completed-todos").style.display = "block";
    //}
}

function Hide2() {
    var temp = document.getElementById("outer-deleted-todos");
   // if(document.getElementById("deleted-todos").style.display == "block"){
    //    temp.innerHTML ="Show Deleted Items";
        document.getElementById("deleted-todos").style.display = "none";
   // }
   // else if(document.getElementById("deleted-todos").style.display == "none"){
     //   temp.innerText ="Show Completed Items";
      //  document.getElementById("completed-todos").style.display = "block";
   // }
}

function add_todo_elements(id, todos_data_json){

    var todos = JSON.parse(todos_data_json);
    TODO = todos;
    var parent = document.getElementById(id);
    //var completed_element = document.getElementById("completed-todos");
   // var deleted_element = document.getElementById("deleted-todos");
   // parent.innerText = todos_data_json;
    parent.innerHTML = "";
    if (parent){
        Object.keys(todos).forEach(
            function (key) {
                var todo_element = createTodoElement(key,todos[key]);
                if(todos[key].status == "ACTIVE") {
                    parent.appendChild(todo_element);
                }
            }
        )
    }
}

function createTodoElement(id, todo_object) {

    var todo_element = document.createElement("div");


    if(todo_object.status =="ACTIVE"){
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick", "completeTodoAJAX(" + id +  ")");
        checkbox.setAttribute("style", "float:left")
        checkbox.setAttribute("class", "breathHorizontal");
        todo_element.appendChild(checkbox);
    }

    var new_element = document.createElement("div");
    new_element.innerText = todo_object.title;
    new_element.setAttribute("style","float : left; margin-left : 10px")
    todo_element.appendChild(new_element);


    todo_element.setAttribute("id","delete" +id);

    todo_element.setAttribute("class", "todoStatus" + todo_object.status+ " " + "breathVertical");

   /* if(todo_element.status == "COMPLETE"){
        var completed_element = document.getElementById("completed-todos");

    }*/

    if(todo_object.status !="DELETE"){
        var delete_button = document.createElement("i");
        delete_button.setAttribute("class","fa fa-times");
        delete_button.setAttribute("aria-hidden","true");
        delete_button.setAttribute("onclick", "deleteTodoAJAX(" + id + ")");
        delete_button.setAttribute("style","color:red; margin-left: 10px");
        todo_element.appendChild(delete_button);
    }


    return todo_element;
}

// Repo URL - https://github.com/malikankit/todo-august-28

function getTodosAJAX(){

    // xhr - JS object for making requests to server via JS
    xhr = new XMLHttpRequest();
    //
    xhr.open("GET", "/api/todos", true);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                add_todo_elements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    }// end of callback

    xhr.send(data=null);

}

function addTodoAJAX() {

    var title =document.getElementById(NEW_TODO_INPUT_ID);
    console.log(title);

    var title = title.value;

    console.log(title);

    xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var data = "todo_title=" + encodeURI(title);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {

            if (xhr.status == STATUS_OK) {
                add_todo_elements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }

    xhr.send(data);

}

function completeTodoAJAX(id) {
    xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";

    var final_element = document.getElementById("completed-todos");

    var completed_element = document.createElement("div");
    completed_element.setAttribute("style","margin-left :100px;");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("checked","");
   // checkbox.setAttribute("onclick", "completeTodoAJAX(" + id + ")");
    checkbox.setAttribute("style", "float:left");
    checkbox.setAttribute("class", "breathHorizontal");
    completed_element.appendChild(checkbox);

    var new_element = document.createElement("div");
    new_element.setAttribute("class","complete");
    new_element.innerText += TODO[id].title;
    new_element.setAttribute("style","float:left; margin-left : 10px");
    completed_element.appendChild(new_element);


    completed_element.setAttribute("data-id", id);
    completed_element.setAttribute("id","delete"+id);
    completed_element.setAttribute("class", "breathVertical");


    if(TODO[id].status !="DELETE"){
        var delete_button = document.createElement("i");
      //  delete_button.setAttribute("id","delete" + id);

        delete_button.setAttribute("class","fa fa-times");
        delete_button.setAttribute("aria-hidden","true");
        if(delete_button.setAttribute("onclick", "deleteTodoAJAX(" + id + ")")){
            console.log("working");
        }
        delete_button.setAttribute("style","color:red; margin-left: 10px");
        completed_element.appendChild(delete_button);
    }



    if(!flag){
        final_element.appendChild(completed_element);
        flag = false;
    }



    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {

            if (xhr.status == STATUS_OK) {
                add_todo_elements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function deleteTodoAJAX(id) {

    xhr = new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data = "todo_status=DELETE";

    flag = true;

    var remove = document.getElementById("delete"+id);
    console.log(remove);
    remove.setAttribute("class","remove");
  //  remove.removeChild(document.getElementById("1"));

    var final_element = document.getElementById("deleted-todos");

    var deleted_element = document.createElement("div");
    deleted_element.setAttribute("style","margin-left :110px;");
    deleted_element.setAttribute("class","delete");
    deleted_element.innerText += TODO[id].title;
   // new_element.setAttribute("style","float:left; margin-left : 10px");
    final_element.appendChild(deleted_element);


    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {

            if (xhr.status == STATUS_OK) {
                add_todo_elements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    console.log("In fun");
    xhr.send(data);
}


