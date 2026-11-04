package com.umc.bookrental.book;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, Long> {

    // N+1 방지: category까지 한 번에 fetch join
    @Query("select b from Book b join fetch b.category order by b.bookId desc")
    List<Book> findAllWithCategory();
}
