// [id]/page.tsx
import { Suspense } from "react";

interface DynamicPageProps {
  // URL의 동적 경로 값이 들어 있는 Promise
  // 예를 들어서 경로가 /todos/[id] 라면 -> /todos/3의 params를 await 했을 때 {id:"3"}을 얻음
  params: Promise<{ id: string }>;
}

interface Todo {
  //API 응답에서 이 화면이 사용하는 필드는 title
  title: string;
}

//next.js가 이 경로에 접속했을 때 렌더링하는 페이지 컴포넌트
export default async function DynamicPage({ params }: DynamicPageProps) {
  return (
    //내부 컴포넌트가 데이터를 기다리는 동안 보여줄 화면을 fallback에 지정
    <Suspense fallback={<div>DynamicPageLoading...</div>}>
      {/*페이지가 받은 params를 실제 데이터를 가져오는 컴포넌트에 전달 */}
      <DynamicPageScreen params={params} />
    </Suspense>
  );
}

//URL에 해당하는 할 일을 불러오고, 제목을 화면에 표시하는 컴포넌트
//함수 안에서 await 을 사용하므로 async로 선언
//얘가 내부화면을 준비하는 동안 fallback인 위 컴포넌트를 보여줄 수 있음
async function DynamicPageScreen({ params }: DynamicPageProps) {
  //Promise가 완료되면 {id:"3"}같은 객체를 얻고 구조 분해 할당으로 그 중 id만 꺼냄
  const { id } = await params;

  //URL에 id를 넣어 해당 번호의 할 일을 요청함
  //예를 들어서 id가 "3" 이면, /todos/3 에 요청함
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );

  //response.ok는 HTTP 상태 코드가 200~299일때 true
  //404, 500 같은 응답이면 에러를 발생시켜 아래 코드를 중단함
  if (!response.ok) {
    throw new Error("할 일을 불러오지 못했어요.");
  }

  //응답 본문을 JSON으로 읽어서 JAVAScript 객체로 변환
  // : Todo -> TypeScript 타입 표시라서 실제 응답을 검사하지는 않음
  const todo: Todo = await response.json();

  //데이터를 다 읽었으면 아래 JSX가 로딩 화면 자리에 표시됨
  return (
    <div>
      {/* URL에서 가져온 id를 표시. 예를 들어 Todo 3 */}
      <h1>Todo {id}</h1>

      {/* API에서 받은 할 일 제목을 표시 */}
      <p>{todo.title}</p>
    </div>
  );
}
