package com.umc.dune_BE_study.repository;

import com.umc.dune_BE_study.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}