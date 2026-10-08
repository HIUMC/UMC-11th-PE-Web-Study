package com.wooohju.umcstudy.repository;

import com.wooohju.umcstudy.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
