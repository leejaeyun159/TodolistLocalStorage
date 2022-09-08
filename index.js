'use strict';

const submitForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoForm input');
const todoList = document.querySelector('.todoList');
const clear = document.querySelector('#clearAll');
const submitBtn = document.querySelector("#textSubmit");
const TODOLIST = "TODOLIST"
let localTodoList = []; //로컬 저장용


function saveTodoList() { //중복해서 써야하는 부분이 많아서 빼줌
  localStorage.setItem(TODOLIST, JSON.stringify(localTodoList));
}

function saveTodo(list){
    const todoObj = {
      id: localTodoList.length + 1,
      text: list
    };
    localTodoList.push(todoObj);
    saveTodoList();
}

function updateTodo(e){
    let upTmpText = e.target.previousSibling.innerHTML;
    submitBtn.innerHTML="수정";
    submitBtn.style.animation = "blackToRed 0.5s forwards";
    document.querySelector("#uploadInput").value = upTmpText;
    delTodo(e);
}

function delTodo(e) {
    const { target: button } = e; //target 속성이 주는 button에서 그 버튼이 속한 li를 가져옴(구조분해할당)
    const parent = button.parentNode 
    todoList.removeChild(parent); //button의 parentNode를 DOM 트리에서 삭제함
    localTodoList = localTodoList.filter((li) => li.id !== Number(parent.id)); //노드의 id와 다른 localTodolist의 요소를 필터링
    saveTodoList();
}

function paintTodo(list){
    const li = document.createElement('li');
    const span = document.createElement('span');
    const upBtn = document.createElement("button");
    const delBtn = document.createElement('button');
    
    upBtn.innerText = "수정하기"; //수정하기라는 텍스트 넣기
    delBtn.innerText = "삭제하기"; //삭제라는 텍스트 넣기
    span.innerHTML = list;
    
    upBtn.addEventListener('click',updateTodo);
    delBtn.addEventListener('click',delTodo); //delBtn에 버튼에 리스너를 추가해서 delTodo이벤트 발생

    
    li.appendChild(span);
    li.appendChild(upBtn);
    li.appendChild(delBtn);
    li.id = localTodoList.length + 1;

    todoList.appendChild(li);
    todoList.lastElementChild.style.animation = "fadeUp 1s forwards";
}

function loadTodo(){
    const loadedTodo = localStorage.getItem(TODOLIST);
    if(loadedTodo!==null){
        const parseTodo =  JSON.parse(loadedTodo); //JSON 문자열 구문을 분석하고 결과를 JS값이나 객체로 생성
        for(let todo of parseTodo){
            paintTodo(todo.text);
            saveTodo(todo.text)
        }
    }
}

(function clearAllTodo(){
    clear.addEventListener('click',()=>{
        if(confirm('리스트를 전부 삭제시겠습니까?')) {
            const delUl = document.getElementsByClassName('todoList');
            while(delUl.length > 0){
                delUl[0].parentNode.removeChild(delUl[0]);
            }//모든 노드 지우기
            localStorage.clear();
            alert('모든 리스트가 삭제되었습니다.');
        }
    });
})();

(function init(){
    loadTodo();
    submitForm.addEventListener('submit',(e)=>{
        e.preventDefault();// 새로고침 방지
        if(todoInput.value !==""){ //공백으로 입력됐을 때
            paintTodo(todoInput.value); //input 태그에 value값을 넣어줌
            saveTodo(todoInput.value); //localStorage에 value값을 넣어줌
        }
        else alert("내용을 입력하세요");
        todoInput.value = ""; //input 내용 삭제
        if(submitBtn.innerHTML=="수정"){ //수정으로 넘어갔을 때
            submitBtn.innerHTML = "입력";
            submitBtn.style.animation = "redToBlack 0.5s forwards";
        }
    });
})();

// function loadTodo(){
//     fetch("http://localhost:3000/list", 
//     {method:'GET'})
//       .then(res => res.json())
//       .then(res => {
//         for(let todo of res){
//             paintTodo(todo.text);
//             saveTodo(todo.text);
//         }
//     });
// }//loadTodo fetch용

// function saveTodo(list) {
//     const todoObj = {
//         id: localTodoList.length + 1,
//         text: list,
//     };
//     fetch("http://localhost:3000/list/", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(todoObj),
//     }).then(res=>console.log(res));
//       localTodoList.push(todoObj);
// }//saveTodo fetch용

