'use strict';

const submitForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoForm input');
const todoList = document.querySelector('.todoList');
const clear = document.querySelector('#clearAll');
const submitBtn = document.querySelector("#textSubmit");

const TODOLIST = "TODOLIST"
let localTodoList = []; //로컬 저장용


function saveTodoList() {
  localStorage.setItem(TODOLIST, JSON.stringify(localTodoList));
}

function saveTodo(list){
    const todoObj = {
      index: localTodoList.length + 1,
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
  localTodoList = localTodoList.filter((li) => li.index !== Number(parent.id));
  saveTodoList();
}

function paintTodo(list){
    const li = document.createElement('li');
    const span = document.createElement('span');
    const upBtn = document.createElement("button");
    const delBtn = document.createElement('button');
    
    upBtn.innerText = "수정하기";
    delBtn.innerText = "삭제하기"; //삭제라는 텍스트 넣기
    
    upBtn.addEventListener('click',updateTodo);
    delBtn.addEventListener('click',delTodo); //delBtn에 버튼에 리스너를 추가해서 delTodo이벤트 발생
    span.innerHTML = list;
    
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
        const parseTodo =  JSON.parse(loadedTodo);
        for(let todo of parseTodo){
            paintTodo(todo.text);
            saveTodo(todo.text)
        }
    }
}

(function clearAllTodo(){
    clear.addEventListener('click',()=>{
        if(confirm('데이터를 전부 삭제시겠습니까?')) {
            const delUl = document.getElementsByClassName('todoList');
            while(delUl.length>0){
                delUl[0].parentNode.removeChild(delUl[0]);
            }
            localStorage.clear();
            alert('모든 리스트가 삭제되었습니다.');
        }
    });
})();

(function init(){
    loadTodo();
    submitForm.addEventListener('submit',(e)=>{
        e.preventDefault();// 새로고침 방지
        if(todoInput.value !==""){
            paintTodo(todoInput.value); //input 태그에 value값을 넣어줌
            saveTodo(todoInput.value); //localStorage에 value값을 넣어줌
        }
        else alert("내용을 입력하세요");
        todoInput.value = ""; //input 내용 삭제
        if(submitBtn.innerHTML=="수정"){
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
// }//fetch적용용
