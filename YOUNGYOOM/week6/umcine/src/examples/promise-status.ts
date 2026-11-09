function getMovieTitle(): Promise<string> {
  return Promise.resolve("인셉션");
}

//.then() => 결과가 준비되면 이 함수를 실행
//.catch() => 실패한다면 이 함수를 실행
function loadWithThen() {
  return getMovieTitle()
    .then((title) => console.log(`.then(): ${title}`))
    .catch((error) => console.error(error));
}

//async -> 여기서 await을 사용할거고, 항상 Promise를 반환함
//await -> Promise 결과가 준비될 때 까지 함수의 진행을 잠깐 멈추고, 결과를 받아옴
//catch -> 처리 도중 오류를 받아옴
async function loadWithAsyncAwait() {
  try {
    const title = await getMovieTitle();
    console.log(`async/await: ${title}`);
  } catch (error) {
    console.error(error);
  }
}

loadWithThen();
loadWithAsyncAwait();
