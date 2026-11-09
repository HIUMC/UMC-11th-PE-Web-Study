package com.umc.study.repository;

import com.umc.study.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

// findById 등 기본 CRUD는 JpaRepository가 제공
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
