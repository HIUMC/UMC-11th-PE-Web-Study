// src/main/java/com/umc/movie/entity/BaseTimeEntity.java
//세 엔티티가 모두 createdAt/updatedAt을 똑같은 방식으로 가지므로, 부모 클래스 생성
package com.umc.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass //이 클래스는 그자체로 테이블이 되지는 않지만, 상속하는 자식 엔티티에 컬럼 정의를 물려줌
public abstract class BaseTimeEntity {

    // 처음 저장될 때 Hibernate가 자동으로 채워줍니다. 이후에는 절대 바뀌지 않습니다.
    //INSERT 시점에 한번만 채워지고, 이후 절대 변경 X
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 이 엔티티가 저장될 때마다 Hibernate가 현재 시각으로 자동 갱신합니다.
    // 저장(INSERT/UPDATE) 될 때마다 현재 시각으로 채워짐
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}