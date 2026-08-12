import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useMemo, useState, useRef } from "react";
import Todo from "./Todo";

function App() {
  // id, title, checked로 이루어진 상태 변경 가능한 todo 배열 생성
  const [todo, setTodo] = useState(() => {
    const todoStrFromStorage = window.localStorage.getItem("todo");

    return todoStrFromStorage ? JSON.parse(todoStrFromStorage) : [];
  });

  const inputRef = useRef(null);

  // 전체 todo 배열 바뀔때마다 로컬에 저장하고 콘솔에 찍기
  useEffect(() => {
    const objString = JSON.stringify(todo); // 할일배열 -> json 문자열
    window.localStorage.setItem("todo", objString);
    console.log(todo);
  }, [todo]);

  // 목록 아이디 중 가장 높은 값 기억해두기
  const newId = useMemo(() => {
    const maxId = todo.reduce((acc, current) => {
      return Math.max(acc, current.id);
    }, 0);
    return maxId + 1;
  }, [todo]);

  // title을 받아서 배열 마지막에 새 todo객체를 생성하는 함수
  const addTodo = _title => {
    if (!_title.trim()) return alert("todo가 입력되지 않았습니다.");

    const newTodo = {
      id: newId,
      title: _title,
      checked: false,
    };

    setTodo(prev => [...prev, newTodo]);
  };

  // 수정 : 받은 id와 id가 같은 요소의 checked 속성의 값을 _value로 변경, todo 업데이트
  const checkUpdate = (_id, _value) => {
    setTodo(prev => prev.map(p => (p.id === Number(_id) ? { ...p, checked: _value } : p)));
  };

  // 삭제 : 받은 id와 id가 같은 요소를 제외하고 filter로 새 배열을 만듦
  const deleteTodo = _id => {
    setTodo(prev => prev.filter(p => p.id !== _id));
  };

  const updateTodo = (_id, _title) => {
    setTodo(prev => prev.map(p => (p.id === Number(_id) ? { ...p, title: _title } : p)));
  };

  return (
    <div className="container">
      <h1>My todo App</h1>
      <Form
        onSubmit={e => {
          e.preventDefault();
          console.log(e.target.todo.value);
          addTodo(e.target.todo.value);
          inputRef.current.value = "";
          // e.target.reset();
        }}
      >
        <Form.Group className="mb-3" controlId="todoInput">
          <Form.Label>할일 입력</Form.Label>
          <Form.Control ref={inputRef} type="text" name="todo" placeholder="할일을 입력하세요" />
        </Form.Group>
        <Button type="submit" variant="primary">
          입력
        </Button>
        <hr />
      </Form>
      {todo.map((item, idx) => (
        <Todo
          key={idx}
          data={item}
          checkUpdate={checkUpdate}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}
    </div>
  );
}

export default App;
