type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  // 3. 문자열 "3"을 지우고, 숫자 3으로 고쳤습니다. 
  targetCount: 3, 
};

// 4. printGoal 함수가 문자열을 제대로 반환하도록 고쳤습니다.
// 5. 반환 타입을 명시(: string)한 이유?
// -> 개발자가 실수로 값을 return 하는 것을 까먹거나, 다른 타입(예: 숫자)을 
//    잘못 반환하지 않도록 TypeScript가 강제로 검사하게 만들기 위해서입니다.
function printGoal(goal: WeeklyGoal): string {
  // 에러가 났던 원인인 console.log(goal.title); 를 지우고,
  // 함수가 진짜로 값을 뱉어내도록 return 키워드를 사용했습니다.
  return goal.title; 
}

// 수정된 함수를 실행해 봅니다.
// 함수가 문자열을 제대로 반환하므로 정상적으로 출력됩니다.
const result = printGoal(weeklyGoal);
console.log("결과:", result); // 출력: 결과: TypeScript 예제 연습