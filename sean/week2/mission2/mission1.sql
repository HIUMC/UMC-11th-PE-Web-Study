SELECT 
    b.title, 
    b.description, 
    c.name AS category_name 
FROM book b 
JOIN category c 
    ON b.category_id = c.category_id 
WHERE c.name = '문학' 
    AND b.is_available = TRUE 
ORDER BY b.book_id DESC 
LIMIT 10;

/* 조회 대상이 도서이므로 book을 기준 테이블로 설정했습니다. 이후 결과에 category가 포함되어야 하는데 이는 category 테이블에 있으므로 category에 JOIN 했습니다.
    WHERE 조건은 카테고리 이름이 문학이어야 하고, 대여가능한 상태여야하므로 c.name = '문학' AND b.is_available = TRUE 라는 조건을 걸었습니다.
    book_id는 AUTO_INCREMENT이므로 값이 클수록 최근에 등록한 도서입니다. 최대 10권까지 제한하기 위해 LIMIT 10을 사용하였습니다.
*/